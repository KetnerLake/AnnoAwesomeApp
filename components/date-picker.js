customElements.define( 'aa-date-picker', class extends HTMLElement {
  constructor() {
    super();
    
    this._displayed = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doDateClick = this.doDateClick.bind( this );
    this.doNextClick = this.doNextClick.bind( this );        
    this.doPreviousClick = this.doPreviousClick.bind( this );    

    this.$details = this.querySelector( 'details' );
    const template = document.querySelector( '#calendar_month' );
    this.$calendar = template.content.cloneNode( true );
    this.$details.appendChild( this.$calendar );
    this.$header = this.querySelector( 'div.calendar > div:first-of-type p' );
    this.$previous = this.querySelector( 'div.calendar > div:first-of-type button:first-of-type' );
    this.$previous.addEventListener( this._touch, this.doPreviousClick );
    this.$month = this.querySelector( 'div.month' );
    this.$next = this.querySelector( 'div.calendar > div:first-of-type button:last-of-type' );    
    this.$next.addEventListener( this._touch, this.doNextClick );
    this.$summary = this.querySelector( 'details summary p:last-of-type' );
  }

  doDateClick( evt ) {
    const selected = new Date(
      parseInt( evt.currentTarget.getAttribute( 'data-year' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-month' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-date' ) )
    );
    this.valueAsDate = selected;

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        value: this.valueAsDate
      } 
    } ) );
  }

  doNextClick() {
    let displayed = null;

    if( this._displayed === null ) {
      if( this.getAttribute( 'value' ) === null ) {
        displayed = new Date();
      } else {
        displayed = new Date( this.valueAsDate.getTime() );          
      }
    } else {
      displayed = new Date( this._displayed.getTime() );
    }    

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 11 ) ? year + 1 : year;
    month = ( month + 1 ) % 12;

    this._displayed = new Date(
      year,
      month,
      displayed.getDate()
    );

    this._render();

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        displayed: this._displayed,
        name: this.name,
        value: this.valueAsDate
      }
    } ) );    
  }

  doPreviousClick() {
    let displayed = null;

    if( this._displayed === null ) {
      if( this.getAttribute( 'value' ) === null ) {
        displayed = new Date();
      } else {
        displayed = new Date( this.valueAsDate.getTime() );
      }
    } else {
      displayed = new Date( this._displayed.getTime() );
    }    

    let month = displayed.getMonth();
    let year = displayed.getFullYear();

    year = ( month === 0 ) ? year - 1 : year;
    month = ( month === 0 ) ? 11 : month - 1;

    this._displayed = new Date(
      year,
      month,
      displayed.getDate()
    );

    this._render();

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        displayed: this._displayed,
        name: this.name,
        value: this.valueAsDate
      }
    } ) );    
  }

  _render() {
    let displayed = null;

    if( this._displayed === null ) {
      if( this.getAttribute( 'value' ) === null ) {
        displayed = new Date();
      } else {
        displayed = new Date( this.valueAsDate.getTime() );
      }
    } else {
      displayed = new Date( this._displayed.getTime() );
    }

    let selected = this.valueAsDate === null ? new Date() : new Date( this.valueAsDate.getTime() );
    const today = new Date();    
    const weeks = this.weekCount( displayed.getFullYear(), displayed.getMonth() + 1, 0 );

    if( weeks === 6 ) {
      this.$month.classList.add( 'six' )
    } else {
      this.$month.classList.remove( 'six' );
    }

    let formatted = new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    } ).format( selected );
    this.$summary.textContent = formatted;

    formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } ).format( displayed );    
    this.$header.textContent = `${formatted} ${displayed.getFullYear()}`;

    const calendar = new Date(
      displayed.getFullYear(),
      displayed.getMonth(),
      1
    );
    calendar.setDate( calendar.getDate() - calendar.getDay() );

    while( this.$month.children.length > ( weeks * 7 ) ) {
      this.$month.children[0].removeEventListener( this._touch, this.doDateClick );
      this.$month.children[0].remove();
    }

    while( this.$month.children.length < ( weeks * 7 ) ) {
      const button = document.createElement( 'button' );
      button.addEventListener( this._touch, this.doDateClick );
      button.type = 'button';
      this.$month.appendChild( button );
    }  
    
    for( let c = 0; c < this.$month.children.length; c++ ) {
      this.$month.children[c].textContent = calendar.getDate();
      this.$month.children[c].setAttribute( 'data-year', calendar.getFullYear() );
      this.$month.children[c].setAttribute( 'data-month', calendar.getMonth() );
      this.$month.children[c].setAttribute( 'data-date', calendar.getDate() );

      if(
        calendar.getFullYear() === displayed.getFullYear() &&
        calendar.getMonth() === displayed.getMonth()
      ) {
        this.$month.children[c].classList.remove( 'outside' );
      } else {
        this.$month.children[c].classList.add( 'outside' );
      }

      if(
        calendar.getFullYear() === today.getFullYear() &&
        calendar.getMonth() === today.getMonth() &&
        calendar.getDate() === today.getDate()
      ) {
        this.$month.children[c].classList.add( 'today' );
      } else {
        this.$month.children[c].classList.remove( 'today' );
      }

      if( selected === null ) {
        this.$month.children[c].classList.remove( 'selected' );
      } else {
        if(
          calendar.getFullYear() === selected.getFullYear() &&
          calendar.getMonth() === selected.getMonth() &&
          calendar.getDate() === selected.getDate() &&
          calendar.getMonth() === selected.getMonth()
        ) {
          this.$month.children[c].classList.add( 'selected' );
        } else {
          this.$month.children[c].classList.remove( 'selected' );
        }
      }

      calendar.setDate( calendar.getDate() + 1 );
    }
  }

  // Month is in the range 1 - 12
  // https://stackoverflow.com/questions/2483719/get-weeks-in-month-through-javascript
  weekCount( year, month, start = 0 ) {
    const firstDayOfWeek = start || 0;
    const firstOfMonth = new Date( year, month - 1, 1 );
    const lastOfMonth = new Date( year, month, 0 );
    const numberOfDaysInMonth = lastOfMonth.getDate();
    const firstWeekDay = ( firstOfMonth.getDay() - firstDayOfWeek + 7 ) % 7;
    const used = firstWeekDay + numberOfDaysInMonth;

    return Math.ceil( used / 7 );
  }  

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }  

  connectedCallback() {
    this._upgrade( 'valueAsDate' );
    
    this._render();

    this.$next.addEventListener( this._touch, this.doNextClick );
    this.$previous.addEventListener( this._touch, this.doPreviousClick );    
  }

  disconnectedCallback() {
    this.$next.removeEventListener( this._touch, this.doNextClick );
    this.$previous.removeEventListener( this._touch, this.doPreviousClick );        
  }

  static get observedAttributes() {
    return [
      'value'
    ];
  }  

  attributeChangedCallback( name, old, value ) {    
    if( name === 'value' ) {
      this._render();
    }
  }  

  get valueAsDate() {
    if( this.getAttribute( 'value' ) === null ) {
      return null;
    }

    const parts = this.getAttribute( 'value' ).split( '-' );
    const date = parseInt( parts[2] );
    const month = parseInt( parts[1] );
    const year = parseInt( parts[0] );    

    return new Date( year, month - 1, date );
  }

  set valueAsDate( date ) {
    if( date === null ) {
      this.removeAttribute( 'value' );
    } else {
      this.setAttribute( 'value', date.toISOString().substring( 0, 10 ) );
    }
  }  
} );      
