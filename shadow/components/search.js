import AAIcon from "./icon.js";
import AAIconButton from "./icon-button.js";

export default class AASearch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline;
          min-width: 200px;
          position: relative;
          width: 202px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-icon {
          padding: 0 12px 0 12px;
          --icon-color:             
            invert( 55% ) 
            sepia( 1% ) 
            saturate( 0% ) 
            hue-rotate( 157deg ) 
            brightness( 92% ) 
            contrast( 91% );            
          --icon-cursor: text;
        }

        aa-icon-button::part( icon ) {
          --icon-color:             
            invert( 55% ) 
            sepia( 1% ) 
            saturate( 0% ) 
            hue-rotate( 157deg ) 
            brightness( 92% ) 
            contrast( 91% );
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #272727;          
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          height: 36px;
          line-height: 36px;          
          margin: 0;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
          width: 0;
          -webkit-tap-highlight-color: transparent;
        }

        input::placeholder {
          color: #828282;
          font-family: 'IBM Plex Sans', sans-serif;          
          opacity: 1.0;
        }

        input:placeholder-shown ~ aa-icon-button {
          display: none;
        }        

        label {
          align-items: center;
          background-color: #e9e9e9;
          border: solid 1px transparent;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: text;
          display: flex;
          flex-direction: row;
          min-width: 200px;
          -webkit-tap-highlight-color: transparent;
        }

        :host( [disabled] ) aa-icon,
        :host( [disabled] ) input,
        :host( [disabled] ) label {
          cursor: not-allowed;
          --icon-cursor: disabled;
        }
      </style>
      <label>
        <aa-icon size="s" src="./img/search.svg"></aa-icon>
        <input placeholder="Search" type="search" />
        <aa-icon-button size="s" src="./img/close.svg"></aa-icon-button>
      </label>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'aa-icon-button' );
    this.$clear.addEventListener( this._touch ? 'touchstart' : 'click', ( evt ) => {
      evt.preventDefault();

      this.value = null;

      this.$input.focus();
      
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        bubbles: true,
        cancelable: false,
        composed: true,        
        detail: {
          value: null
        }
      } ) );
    } );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'keyup', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
      
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          value: this.value
        }
      } ) );
    } );
  }

  // When attributes change
  _render() {
    this.$input.disabled = this.disabled;
    this.$input.placeholder = this.placeholder === null ? 'Search' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
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
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );    
    this._upgrade( 'hidden' );
    this._upgrade( 'placeholder' );    
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'placeholder',
      'value'
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

window.customElements.define( 'aa-search', AASearch );
