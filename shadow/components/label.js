export default class AALabel extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        p {
          color: var( --label-color, #272727 );
          cursor: var( --label-cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: var( --label-font-size, 16px );
          font-weight: var( --label-font-weight, 400 );
          line-height: var( --label-line-height, 16px );
          margin: 0;
          padding: 0;          
          text-align: var( --label-text-align, left );          
          text-rendering: optimizeLegibility;
          text-transform: var( --label-text-transform, none );
          width: 100%;
        }

        :host( [balanced] ) {
          text-wrap: balance;
        }

        :host( [inverted] ) p {
          color: #ffffff;
        }

        :host( [size=xs] ) p {
          font-size: 12px;
          line-height: 12px;          
        }

        :host( [size=s] ) p {
          font-size: 14px;
          line-height: 14px;          
        }

        :host( [size=m] ) p {
          font-size: 17px;
          line-height: 17px;          
        }        

        :host( [size=l] ) p {
          font-size: 23px;
          line-height: 23px;          
        }                

        :host( [size=xl] ) p {
          font-size: 32px;
          line-height: 32px;
        }        

        :host( [weight=bold] ) p {
          font-weight: 600;
        }

        :host( [truncate] ) p {
          display: block;
          line-clamp: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }        
      </style>
      <p part="label"></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
  }

   // When attributes change
  _render() {
    this.$label.innerText = this.text === null ? '' : this.text;
  }

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
    this._upgrade( 'balanced' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._upgrade( 'inverted' );    
    this._upgrade( 'size' );        
    this._upgrade( 'text' );            
    this._upgrade( 'truncate' );            
    this._upgrade( 'weight' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'balanced',
      'concealed',
      'hidden',
      'inverted',
      'size',
      'text',
      'truncate',
      'weight'
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
  get balanced() {
    return this.hasAttribute( 'balanced' );
  }

  set balanced( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'balanced' );
      } else {
        this.setAttribute( 'balanced', '' );
      }
    } else {
      this.removeAttribute( 'balanced' );
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

  get text() {
    if( this.hasAttribute( 'text' ) ) {
      return this.getAttribute( 'text' );
    }

    return null;
  }

  set text( value ) {
    if( value !== null ) {
      this.setAttribute( 'text', value );
    } else {
      this.removeAttribute( 'text' );
    }
  }     

  get truncate() {
    return this.hasAttribute( 'truncate' );
  }

  set truncate( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'truncate' );
      } else {
        this.setAttribute( 'truncate', '' );
      }
    } else {
      this.removeAttribute( 'truncate' );
    }
  }    

  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return this.getAttribute( 'weight' );
    }

    return null;
  }

  set weight( value ) {
    if( value !== null ) {
      this.setAttribute( 'weight', value );
    } else {
      this.removeAttribute( 'weight' );
    }
  }       
}

window.customElements.define( 'aa-label', AALabel );
