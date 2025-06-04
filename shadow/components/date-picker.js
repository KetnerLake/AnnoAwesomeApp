import AACalendar from "./calendar.js";
import AADivider from "./divider.js";

export default class AADatePicker extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 296px;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        } 

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 36px;
          margin: 0;
          padding: 0 16px 0 16px;
          width: 100%;
          -webkit-tap-highlight-color: transparent;                    
        }

        span {
          color: #272727;
          font-family: 'IBM Plex Sans', sans-serif;  
          font-size: 16px;
          text-rendering: optimizeLegibility;          
        }

        span[part=label] {
          flex-basis: 0;
          flex-grow: 1;
          text-align: left;
        }

        span[part=value] {
          background-color: #efefef;
          border-radius: 4px;
          height: 28px;
          line-height: 28px;
          padding: 0 8px 0 8px;
        }

        :host( [open] ) span[part=value] {
          color: #0082ff;
        }

        :host( :not( [open] ) ) aa-divider,
        :host( :not( [open] ) ) aa-calendar {
          display: none;
        }

        :host( [invalid] ) span[part=value] {
          color: red;
          text-decoration: line-through;
        }
      </style>
      <button part="button" type="button">
        <span part="label"></span>
        <span part="value"></span>
      </button>
      <aa-divider></aa-divider>
      <aa-calendar></aa-calendar>
    `;

    // Private 
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$button.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.open = !this.open

      this.dispatchEvent( new CustomEvent( 'aa-open', {
        detail: {
          open: this.open
        }
      } ) );
    } );
    this.$calendar = this.shadowRoot.querySelector( 'aa-calendar' );
    this.$calendar.addEventListener( 'aa-change', ( evt ) => {
      this.valueAsDate = evt.detail.value;
      // this.value = evt.detail.value.toISOString().substring( 0, 10 );
    } );
    this.$label = this.shadowRoot.querySelector( 'span[part=label]' );
    this.$value = this.shadowRoot.querySelector( 'span[part=value]' );    
  }

  // When things change
  _render() {
    this.$label.innerText = this.label === null ? '' : this.label;

    const formatted = new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    } ).format( this.valueAsDate === null ? new Date() : this.valueAsDate );    
    this.$value.innerText = formatted;    
    this.$calendar.value = this.value;    
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
    this._upgrade( 'invalid' );                          
    this._upgrade( 'label' );                          
    this._upgrade( 'open' );                              
    this._upgrade( 'value' );                              
    this._upgrade( 'valueAsDate' );                                  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'invalid',
      'label',
      'open',
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
  
  get invalid() {
    return this.hasAttribute( 'invalid' );
  }

  set invalid( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'invalid' );
      } else {
        this.setAttribute( 'invalid', '' );
      }
    } else {
      this.removeAttribute( 'invalid' );
    }
  }  

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }           

  get open() {
    return this.hasAttribute( 'open' );
  }

  set open( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'open' );
      } else {
        this.setAttribute( 'open', '' );
      }
    } else {
      this.removeAttribute( 'open' );
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

window.customElements.define( 'aa-date-picker', AADatePicker );
