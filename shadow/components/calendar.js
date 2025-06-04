import AAHBox from "./hbox.js";
import AAIconButton from "./icon-button.js";
import AALabel from "./label.js";

export default class AACalendar extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        } 

        aa-hbox[part=days] {
          padding: 0 16px 0 16px;
        }

        aa-hbox[part=days] aa-label {
          flex-basis: 0;
          flex-grow: 1;
          --label-color: #c6c6c6;
          --label-font-size: 14px;
          --label-line-height: 36px;          
          --label-text-align: center;
          --label-text-transform: uppercase;          
        }

        aa-hbox[part=header] {
          padding: 8px 16px 0 16px;
        }

        aa-hbox[part=header] aa-label {
          flex-basis: 0;
          flex-grow: 1;
        }        

        div[part=month] {
          box-sizing: border-box;
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
          gap: 2px 2px;           
          padding: 0 16px 8px 16px;
        }

        div[part=month] button {
          appearance: none;
          background: none;
          border: none;
          border-radius: 36px;
          box-sizing: border-box;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;            
          font-size: 16px;          
          height: 36px;
          line-height: 36px;
          margin: 0;
          outline: none;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          width: 36px;
          -webkit-tap-highlight-color: transparent;
        }

        div[part=month] button.outside {
          visibility: hidden;
        }

        div[part=month] button.selected {
          background-color: #0082ff4d;
          color: #0082ff;
          font-weight: 600;          
        }

        div[part=month] button.today {
          color: #0082ff;
        }

        div[part=month] button.today.selected {
          background: #0082ff;
          color: #ffffff;
          font-weight: 600;                    
        }
      </style>
      <aa-hbox centered gap="m" part="header">
        <aa-label weight="bold"></aa-label>
        <aa-icon-button part="left" src="./img/chevron-left.svg"></aa-icon-button>
        <aa-icon-button part="right" src="./img/chevron-right.svg"></aa-icon-button>
      </aa-hbox>
      <aa-hbox part="days">
        <aa-label text="Sun"></aa-label>
        <aa-label text="Mon"></aa-label>
        <aa-label text="Tue"></aa-label>
        <aa-label text="Wed"></aa-label>
        <aa-label text="Thu"></aa-label>
        <aa-label text="Fri"></aa-label>                
        <aa-label text="Sat"></aa-label>        
      </aa-hbox>
      <div part="month"></div>
    `;

    // Private 
    this._data = null;
    this._display = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Events
    this.doDateClick = this.doDateClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$header = this.shadowRoot.querySelector( 'aa-hbox[part=header] aa-label' );
    this.$left = this.shadowRoot.querySelector( 'aa-icon-button[part=left]' );    
    this.$left.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      let displayed = null;

      if( this._display === null ) {
        if( this.value === null ) {
          displayed = new Date();
        } else {
          displayed = new Date( this.valueAsDate.getTime() );
        }
      } else {
        displayed = new Date( this._display.getTime() );
      }    
  
      let month = displayed.getMonth();
      let year = displayed.getFullYear();
  
      year = ( month === 0 ) ? year - 1 : year;
      month = ( month === 0 ) ? 11 : month - 1;
  
      this._display = new Date(
        year,
        month,
        displayed.getDate()
      );
  
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          display: this._display,
          name: this.name,
          value: this.valueAsDate
        }
      } ) );
    } );
    this.$month = this.shadowRoot.querySelector( 'div[part=month]' );
    this.$right = this.shadowRoot.querySelector( 'aa-icon-button[part=right]' );
    this.$right.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      let displayed = null;

      if( this._display === null ) {
        if( this.value === null ) {
          displayed = new Date();
        } else {
          displayed = new Date( this.valueAsDate.getTime() );          
        }
      } else {
        displayed = new Date( this._display.getTime() );
      }    
  
      let month = displayed.getMonth();
      let year = displayed.getFullYear();
  
      year = ( month === 11 ) ? year + 1 : year;
      month = ( month + 1 ) % 12;
  
      this._display = new Date(
        year,
        month,
        displayed.getDate()
      );
  
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          display: this._display,
          name: this.name,
          value: this.valueAsDate
        }
      } ) );
    } );
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

  // When things change
  _render() {
    let displayed = null;
    if( this._display === null ) {
      if( this.value === null ) {
        displayed = new Date();
      } else {
        displayed = new Date( this.valueAsDate.getTime() );
      }
    } else {
      displayed = new Date( this._display.getTime() );
    }

    let selected = this.valueAsDate === null ? new Date() : new Date( this.valueAsDate.getTime() );
    const today = new Date();    
    const weeks = this.weekCount( displayed.getFullYear(), displayed.getMonth() + 1, 0 );

    const formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } ).format( displayed );    
    this.$header.text = `${formatted} ${displayed.getFullYear()}`;

    const calendar = new Date(
      displayed.getFullYear(),
      displayed.getMonth(),
      1
    );
    calendar.setDate( calendar.getDate() - calendar.getDay() );

    while( this.$month.children.length > ( weeks * 7 ) ) {
      this.$month.children[0].removeEventListener( this._touch ? 'touchstart' : 'click', this.doDateClick );
      this.$month.children[0].remove();
    }

    while( this.$month.children.length < ( weeks * 7 ) ) {
      const button = document.createElement( 'button' );
      button.addEventListener( this._touch ? 'touchstart' : 'click', this.doDateClick );
      button.type = 'button';
      this.$month.appendChild( button );
    }  
    
    for( let c = 0; c < this.$month.children.length; c++ ) {
      this.$month.children[c].innerText = calendar.getDate();
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

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );                              
    this._upgrade( 'data' );                          
    this._upgrade( 'hidden' );                      
    this._upgrade( 'value' );                              
    this._upgrade( 'valueAsDate' );                                  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'value'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get data() {
    return this._data
  }

  set data( value ) {
    this._data = value;
  }

  get valueAsDate() {
    if( this.value === null ) {
      return null;
    }

    const parts = this.value.split( '-' );
    return this.value === null ? null : new Date( parts[0], parts[1] - 1, parts[2] );
  }

  set valueAsDate( date ) {
    this.value = date === null ? null : date.toISOString().substring( 0, 10 );
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }   

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }   

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }            
}

window.customElements.define( 'aa-calendar', AACalendar );
