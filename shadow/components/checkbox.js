export default class AACheckbox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inherit;
          height: 20px;
          min-height: 20px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        } 

        button {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          margin: 0;
          outline: none;
          padding: 0;
          -webkit-tap-highlight-color: transparent;            
        }

        svg {
          color: var( --checkbox-color, #1badf8 );
        }

        :host( [disabled] ) svg {
          color: #c6c6c6;
        }

        :host( [checked] ) path:last-of-type {
          display: none;
        }

        :host( [checked] ) path:first-of-type {
          display: block;
        }        

        :host( :not( [checked] ) ) path:last-of-type {
          display: block;
        }

        :host( :not( [checked] ) ) path:first-of-type {
          display: none;
        }                
      </style>
      <button part="button" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>          
        </svg>
      </button>
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
      this.checked = !this.checked 
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          checked: this.checked
        }
      } ) );
    } );
    this.$icon = this.shadowRoot.querySelector( 'aa-icon' );
  }

   // When attributes change
  _render() {;}

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'checked' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'disabled' );  
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
      'concealed',
      'disabled',
      'hidden'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
    }
  }

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

  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
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
}

window.customElements.define( 'aa-checkbox', AACheckbox );
