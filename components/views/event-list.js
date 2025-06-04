customElements.define( 'aa-event-list', class extends HTMLElement {
  constructor() {
    super();

    this._colors = [];
    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doAddClick = this.doAddClick.bind( this );
    this.doItemClick = this.doItemClick.bind( this );
    this.doTitleClick = this.doTitleClick.bind( this );

    this.$add = this.querySelector( 'div:last-of-type > button' );
    this.$empty = this.querySelector( 'p' );
    this.$list = this.querySelector( 'ul' );
    this.$title = this.querySelector( 'h3' );
    this.$template = document.querySelector( '#event_list_renderer' );
  }

  show( id = null ) {
    if( id !== null ) {
      const event = this.$list.querySelector( `li[data-id="${id}"]` );
      event.scrollIntoView( {
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      } );
    }
  }

  doAddClick() {
    this.dispatchEvent( new CustomEvent( 'aa-add' ) );    
  }

  doItemClick( evt ) {
    this.setAttribute( 'selected-item', evt.currentTarget.getAttribute( 'data-id' ) );
    this.dispatchEvent( new CustomEvent( 'aa-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        id: evt.currentTarget.getAttribute( 'data-id' )
      }
    } ) );
  }

  doTitleClick() {
    this.dispatchEvent( new CustomEvent( 'aa-sort' ) );
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'colors' );
    this._upgrade( 'data' );

    if( this.$add !== null ) {
      this.$add.addEventListener( this._touch, this.doAddClick );
    }

    if( this.$title !== null ) {
      this.$title.addEventListener( this._touch, this.doTitleClick );
    }
  }

  disconnectedCallback() {
    if( this.$add !== null ) {
      this.$add.removeEventListener( this._touch, this.doAddClick );
    }

    if( this.$title !== null ) {
      this.$title.removeEventListener( this._touch, this.doTitleClick );
    }
  }

  static get observedAttributes () {
    return [
      'selected-item',
      'use-calendar-color'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'selected-item' ) {
      for( let c = 0; c < this.$list.children.length; c++ ) {
        if( this.$list.children[c].getAttribute( 'data-id' ) === newValue ) {
          this.$list.children[c].classList.add( 'selected' );
        } else {
          this.$list.children[c].classList.remove( 'selected' );
        }
      }      
    }

    if( name === 'use-calendar-color' ) {
      for( let c = 0; c < this.$list.children.length; c++ ) {
        let color = this.$list.children[c].getAttribute( 'data-month-color' );
        if( this.hasAttribute( 'use-calendar-color' ) ) {
          color = this.$list.children[c].getAttribute( 'data-calendar-color' );
        }        

        const day = this.$list.children[c].querySelector( 'div.backdrop > div' );
        day.children[0].style.color = `hsl( from ${color} h s calc( l - 20 ) )`;                      
        day.children[1].style.color = `hsl( from ${color} h s calc( l - 20 ) )`;                              
        day.style.backgroundColor = `${color}4d`;                      
      }
    }
  }  

  get colors() {
    return this._colors.length === 0 ? null : this._colors;
  }

  set colors( value ) {
    this._colors = value === null ? [] : [... value];
  }

  get data() {
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    if( this._data.length === 0 ) {
      this.$list.innerHTML = '';
    }

    while( this.$list.children.length > this._data.length ) {
      this.$list.children[0].removeEventListener( this._touch, this.doItemClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const clone = this.$template.content.cloneNode( true );
      this.$list.appendChild( clone );
      this.$list.children[this.$list.children.length - 1].addEventListener( this._touch, this.doItemClick );      
    }          

    // const now = new Date().getTime();

    for( let c = 0; c < this.$list.children.length; c++ ) {
      const index = this._data[c].startsAt.getMonth();
      this.$list.children[c].setAttribute( 'data-id', this._data[c].id );
      this.$list.children[c].setAttribute( 'data-calendar-color', this._data[c].color );          
      this.$list.children[c].setAttribute( 'data-month-color', this._colors[index % this._colors.length].value );                        

      /*
      if( now > this._data[c].endsAt.getTime() ) {
        this.$list.children[c].classList.add( 'outdated' );
      } else {
        this.$list.children[c].classList.remove( 'outdated' );
      }
      */

      let color = this._colors[index % this._colors.length].value;
      if( this.hasAttribute( 'use-calendar-color' ) ) {
        color = this._data[c].color;
      }

      const day = this.$list.children[c].querySelector( 'p.day' );
      day.parentElement.style.backgroundColor = color + '4d';
      day.textContent = this._data[c].startsAt.getDate();
      day.style.color = `hsl( from ${color} h s calc( l - 20 ) )`;

      let formatted = new Intl.DateTimeFormat( navigator.language, {
        month: 'short'
      } ).format( this._data[c].startsAt );

      const month = this.$list.children[c].querySelector( 'p.month' );
      month.textContent = formatted;
      month.style.color = `hsl( from ${color} h s calc( l - 20 ) )`;

      const summary = this.$list.children[c].querySelector( '.summary' );
      summary.textContent = this._data[c].summary;

      const location = this.$list.children[c].querySelector( '.location' );
      location.textContent = this._data[c].location === null ? '' : this._data[c].location;      
      
      const label = this.$list.children[c].querySelector( '.ends' );
      const starts = this.$list.children[c].querySelector( '.starts' );

      if( this._data[c].startsAt.getDate() === this._data[c].endsAt.getDate() &&
          this._data[c].startsAt.getMonth() === this._data[c].endsAt.getMonth() ) {
        label.textContent = '';
        starts.textContent = '';
      } else {
        formatted = new Intl.DateTimeFormat( navigator.language, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        } ).format( this._data[c].endsAt );
        label.textContent = 'Ends';      
        starts.textContent = formatted;  
      }      
    }          
  }
} );
