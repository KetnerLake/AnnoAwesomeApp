export default class AARainbow extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        @keyframes wizard {
          to {
            background-position: 0 -200%
          }
        }

        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        p {
          animation: wizard 2s linear infinite;                              
          background: 
            linear-gradient( 
              rgb( 255, 0, 0 ) 0%, 
              rgb( 255, 154, 0 ) 10%, 
              rgb( 208, 222, 33 ) 20%, 
              rgb( 79, 220, 74 ) 30%, 
              rgb( 63, 218, 216 ) 40%, 
              rgb( 47, 201, 226 ) 50%, 
              rgb( 28, 127, 238 ) 60%, 
              rgb( 95, 21, 242 ) 70%, 
              rgb( 186, 12, 248 ) 80%, 
              rgb( 251, 7, 217 ) 90%, 
              rgba( 255, 0, 0 ) 100%
            ) 0 0 / 100% 200%;
          background-clip: text;
          color: transparent;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          line-height: 16px;
          margin: 0;
          padding: 0; 
          text-align: center;         
          text-rendering: optimizeLegibility;
          width: 100%;
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
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._upgrade( 'text' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'text'
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
}

window.customElements.define( 'aa-rainbow', AARainbow );
