import AACheckbox from "../checkbox.js";
import AAIconButton from "../icon-button.js";
import AALabel from "../label.js";

export default class AACalendarListRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          border-bottom: solid 1px #e5e5e5;          
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 12px;
          height: 36px;
          min-height: 36px;
          padding: 0 8px 0 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-icon-button {
          --icon-color:
            invert( 30% ) 
            sepia( 94% ) 
            saturate( 1956% ) 
            hue-rotate( 196deg ) 
            brightness( 103% ) 
            contrast( 104% );          
        }

        aa-label {
          flex-basis: 0;
          flex-grow: 1;
        }
      </style>
      <aa-checkbox></aa-checkbox>
      <aa-label part="label"></aa-label>
      <aa-icon-button part="info" src="./img/info-circle.svg"></aa-icon-button>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$checkbox = this.shadowRoot.querySelector( 'aa-checkbox' );
    this.$checkbox.addEventListener( 'aa-change', ( evt ) => {
      this.dispatchEvent( new CustomEvent( 'aa-active', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          active: evt.detail.checked,
          id: this._data.id
        }
      } ) );
    } );
    this.$label = this.shadowRoot.querySelector( 'aa-label' );
    this.$info = this.shadowRoot.querySelector( 'aa-icon-button' );
    this.$info.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-info', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          id: this._data.id
        }
      } ) );
    } );
  }

   // When attributes change
  _render() {
    this.$checkbox.disabled = this.disabled;
    this.$info.disabled = this.disabled;
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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
    this._data = structuredClone( value );

    this.$checkbox.checked = this._data.isActive;
    this.$checkbox.style.setProperty( '--checkbox-color', this._data.color === null ? '' : this._data.color );

    this.$label.text = this._data.name;
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
}

window.customElements.define( 'aa-calendar-list-renderer', AACalendarListRenderer );
