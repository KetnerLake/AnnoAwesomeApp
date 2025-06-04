export default class AATextarea extends HTMLElement {
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

        textarea {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #272727;
          font-family: 'IBM Plex Sans', sans-serif;  
          font-size: 16px;
          height: 36px;
          line-height: 21px;
          margin: 0;
          min-height: 100px;
          outline: none;
          padding: 8px 16px 0 16px;
          resize: none;
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent;                    
        }

        textarea::placeholder {
          color: #c6c6c6;
          opacity: 1.0;
        }
      </style>
      <textarea></textarea>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$textarea = this.shadowRoot.querySelector( 'textarea' );
    this.$textarea.addEventListener( 'keyup', () => {
      this.value = this.$textarea.value.length === 0 ? null : this.$textarea.value 

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );      
    } );
  }

  // When things change
  _render() {
    this.$textarea.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$textarea.value = this.value;
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
    this._upgrade( 'placeholder' );                          
    this._upgrade( 'value' );                              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'placeholder',
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

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
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

window.customElements.define( 'aa-textarea', AATextarea );
