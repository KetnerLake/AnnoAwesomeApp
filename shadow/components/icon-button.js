import AAIcon from "./icon.js";

export default class AAIconButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        aa-icon {
          --icon-cursor: pointer;
        }

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 36px;
          justify-content: center;
          margin: 0;
          outline: none;
          padding: 0;
          width: 36px;
          -webkit-tap-highlight-color: transparent;            
        }

        :host( [checked] ) button {
          background-color: #0082ff;
        }

        :host( [checked] ) aa-icon {
          --icon-color: 
            invert( 98% ) 
            sepia( 2% ) 
            saturate( 2077% ) 
            hue-rotate( 187deg ) 
            brightness( 100% ) 
            contrast( 96% );
        }        

        :host( [disabled] ) aa-icon {
          --icon-cursor: not-allowed;
        }

        :host( [disabled][checked] ) button {
          background-color: #dad9e0;
        }        

        :host( [disabled] ) button {
          cursor: not-allowed;
        }
      </style>
      <button part="button" type="button">
        <aa-icon part="icon"></aa-icon>
      </button>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$icon = this.shadowRoot.querySelector( 'aa-icon' );
  }

  // When things change
  _render() {
    this.$button.disabled = this.disabled;
    this.$icon.disabled = this.disabled;
    this.$icon.flat = this.flat;
    // this.$icon.inverted = this.inverted;
    this.$icon.src = this.src;
    this.$icon.size = this.size;
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
    this._upgrade( 'checked' );                              
    this._upgrade( 'concealed' );                          
    this._upgrade( 'data' );                      
    this._upgrade( 'disabled' );                          
    this._upgrade( 'flat' );                          
    this._upgrade( 'hidden' );                      
    this._upgrade( 'inverted' );                          
    this._upgrade( 'size' );                              
    this._upgrade( 'src' );                              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
      'concealed',
      'disabled',
      'flat',
      'hidden',
      'inverted',
      'size',
      'src'
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

  get flat() {
    return this.hasAttribute( 'flat' );
  }

  set flat( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'flat' );
      } else {
        this.setAttribute( 'flat', '' );
      }
    } else {
      this.removeAttribute( 'flat' );
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

  get inverted() {
    return this.hasAttribute( 'inverted' );
  }

  set inverted( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'inverted' );
      } else {
        this.setAttribute( 'inverted', '' );
      }
    } else {
      this.removeAttribute( 'inverted' );
    }
  }  
  
  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }  

  get src() {
    if( this.hasAttribute( 'src' ) ) {
      return this.getAttribute( 'src' );
    }

    return null;
  }

  set src( value ) {
    if( value !== null ) {
      this.setAttribute( 'src', value );
    } else {
      this.removeAttribute( 'src' );
    }
  }  
}

window.customElements.define( 'aa-icon-button', AAIconButton );
