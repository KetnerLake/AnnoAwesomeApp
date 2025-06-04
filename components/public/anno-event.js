export default class AAEvent extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: var( --event-inactive-background-color );
          border-left-color: var( --event-active-background-color );          
          border-left-style: solid;
          border-left-width: 4px;          
          border-radius: 4px;         
          box-sizing: border-box;
          cursor: var( --event-cursor, default );
          display: flex;
          flex-direction: row;
          padding: 2px 4px 0 4px;
          position: absolute;
        }

        p {
          color: var( --event-inactive-color );
          cursor: var( --event-cursor, default );
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 16px;
          margin: 0;
          overflow: hidden;
          padding: 0;
          text-align: left;
          text-overflow: ellipsis;
          text-rendering: optimizeLegibility;
          white-space: nowrap;
          width: 100%;
        }

        p span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p span:last-of-type {        
          font-weight: 400;
          padding: 2px 0 0 0;
        }
      </style>
      <p>
        <span></span>
        <span></span>
      </p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$summary = this.shadowRoot.querySelector( 'p span:first-of-type' );
    this.$location = this.shadowRoot.querySelector( 'p span:last-of-type' );    
  }

   // When attributes change
  _render() {
    this.$summary.textContent = this.summary === null ? '' : this.summary;
    this.$location.textContent = this.location === null ? '' : this.location;    
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
    this._upgrade( 'location' );        
    this._upgrade( 'summary' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'location',
      'summary'
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
  get location() {
    if( this.hasAttribute( 'location' ) ) {
      return this.getAttribute( 'location' );
    }

    return null;
  }

  set location( value ) {
    if( value !== null ) {
      this.setAttribute( 'location', value );
    } else {
      this.removeAttribute( 'location' );
    }
  }

  get summary() {
    if( this.hasAttribute( 'summary' ) ) {
      return this.getAttribute( 'summary' );
    }

    return null;
  }

  set summary( value ) {
    if( value !== null ) {
      this.setAttribute( 'summary', value );
    } else {
      this.removeAttribute( 'summary' );
    }
  }  
}

window.customElements.define( 'anno-event', AAEvent );
