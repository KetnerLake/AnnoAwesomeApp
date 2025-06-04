export default class AADetails extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow:
            0 0 40px -10px rgba( 0, 0, 0, 0.30 ),
            0 0 25px -15px rgba( 0, 0, 0, 0.20 );           
          box-sizing: border-box;
          display: none;
          flex-direction: column;
          padding: 16px 0 16px 0;
          position: absolute;
          right: 50%;
          transform: translate( 50% );
          top: 50%;
          width: 360px;              
          z-index: 50;
        }

        :host( [open] ) {
          display: flex;
        }

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          color: #0082ff;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          font-size: 16px;
          justify-content: center;
          gap: 8px;
          height: 36px;
          line-height: 36px;
          margin: 0;
          outline: transparent;
          padding: 0;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;            
        }        

        nav {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: 16px;
          padding: 0 16px 0 16px;
        }

        nav h3 {
          color: #272727;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          line-height: 36px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }
      </style>
      <nav>
        <h3>Birthday</h3>
        <button type="button">Done</button>
      </nav>
    `;

    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';        

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$done = this.shadowRoot.querySelector( 'button' );
    this.$done.addEventListener( this._touch, () => {
      this.dispatchEvent( new CustomEvent( 'aa-done' ) );
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
    this._data = value === null ? null : structuredClone( value );
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

window.customElements.define( 'anno-details', AADetails );
