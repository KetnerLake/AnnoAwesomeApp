export default class AAToggle extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
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

        button {
          align-items: center;
          appearance: none;
          background: none;
          background-color: #e9e9e9;
          border: none;
          border-radius: 28px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 28px;
          margin: 0;
          outline: none;
          padding: 0;
          position: relative;
          transition: background 0.25s linear;
          width: 50px;
          -webkit-tap-highlight-color: transparent;                      
        }

        span {
          background-color: #ffffff;
          border-radius: 24px;
          box-sizing: border-box;
          display: block;
          left: 2px;
          max-height: 24px;
          min-height: 24px;
          max-width: 24px;
          min-width: 24px;
          position: absolute;
          top: 2px;
          transition: left 0.25s linear;
        }

        :host( [checked] ) button {
          background: #34c759;
        }

        :host( [checked] ) span {
          left: 24px;
        }        
      </style>
      <button part="button" type="button">
        <span></span>
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
      this.checked = !this.checked;
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          checked: this.checked
        }
      } ) );
    } );
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
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
      'concealed',
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

window.customElements.define( 'aa-toggle', AAToggle );
