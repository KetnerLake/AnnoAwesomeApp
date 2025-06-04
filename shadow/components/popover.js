export default class AAPopover extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: none;
          position: absolute;
          width: 300px;
          z-index: 100;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        :host( [open] ) {
          display: block;
        }

        div {
          border: none;
          border-radius: 4px;
          box-shadow:
            0 0 40px -10px rgba( 0, 0, 0, 0.30 ),
            0 0 25px -15px rgba( 0, 0, 0, 0.20 );
          box-sizing: border-box;
          overflow: hidden;
        }
      </style>
      <div>
        <slot></slot>
      </div>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // Rough to HTML popover API
  hidePopover() {
    this.open = false;
  }

  showPopover() {
    this.open = true;
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
    this._upgrade( 'concealed' );        
    this._upgrade( 'data' );        
    this._upgrade( 'hidden' );    
    this._upgrade( 'open' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'open'
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
}

window.customElements.define( 'aa-popover', AAPopover );
