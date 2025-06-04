export default class AAIcon extends HTMLElement {
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

        img {
          box-sizing: border-box;
          cursor: var( --icon-cursor, default );
          display: block;
          filter: var( --icon-color, 
            invert( 31% ) 
            sepia( 49% ) 
            saturate( 3696% ) 
            hue-rotate( 198deg ) 
            brightness( 106% ) 
            contrast( 103% )
          );            
          height: 20px;
          width: 20px;
        }

        :host( [inverted] ) img {
          filter: 
            invert( 100% ) 
            sepia( 36% ) 
            saturate( 0% ) 
            hue-rotate( 249deg ) 
            brightness( 114% ) 
            contrast( 100% );                    
        }

        :host( [size=xs] ) img {
          height: 12px;
          width: 12px;
        }

        :host( [size=s] ) img {
          height: 16px;
          width: 16px;
        }

        :host( [size=l] ) img {
          height: 32px;
          width: 32px;
        }

        :host( [disabled] ) img {
          filter: 
            invert( 86% ) 
            sepia( 7% ) 
            saturate( 7% ) 
            hue-rotate( 321deg ) 
            brightness( 79% ) 
            contrast( 100% );          
        }        
      </style>
      <img part="icon" />
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'img' );
  }

  // When things change
  _render() {
    this.$icon.src = this.src === null ? '' : this.src;
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
    this._upgrade( 'disabled' );                          
    this._upgrade( 'hidden' );                      
    this._upgrade( 'inverted' );                          
    this._upgrade( 'size' );                        
    this._upgrade( 'src' );                                    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
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

window.customElements.define( 'aa-icon', AAIcon );
