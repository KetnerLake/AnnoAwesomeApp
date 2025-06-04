export default class AAEvent extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          position: absolute;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          appearance: none;
          /* background-color: #ffa5004d */;
          background-color: var( --event-inactive-background-color );
          border: none;
          /* border-left: solid 4px #ffa500; */
          border-left-color: var( --event-active-background-color );          
          border-left-style: solid;
          border-left-width: 4px;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: column;                    
          font-family: 'IBM Plex Sans', sans-serif;
          height: 100%;
          /* min-height: var( --event-duration, 35px ); */
          margin: 0;
          min-width: 164px;
          padding: 0;
          text-align: left;
          width: 164px;          
        }

        span {
          box-sizing: border-box;
          /* color: #ff8c00; */
          color: var( --event-inactive-color );
          font-size: 14px;
          margin: 0;
          min-width: 0;
          overflow: hidden;
          padding: 0 0 0 4px;
          text-overflow: ellipsis;
          text-rendering: optimizeLegibility;
          white-space: nowrap;
        }

        span[part=location] {
          margin-top: -2px;
        }

        span[part=summary] {
          font-weight: 600;
        }

        /*
        button:focus {
          background-color: var( --event-active-background-color );
        }

        button:focus span {
          color: var( --event-active-color );
        }
        */

        :host( :not( [location] ) ) span[part=location] {
          display: none;
        }

        :host( [selected] ) button {
          background-color: var( --event-active-background-color );
        }

        :host( [selected] ) span {
          color: var( --event-active-color );
        }

        :host( :not( [summary] ) ) span[part=summary] {
          display: none;
        }
      </style>
      <button type="button">
        <span part="summary"></span>
        <span part="location"></span>  
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
      this.selected = !this.selected;
      // if( !this.selected ) this.$button.blur();
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          // id: this.selected ? this.data.id : null
          id: this.data.id
        }
      } ) );
    } );    
    this.$location = this.shadowRoot.querySelector( 'span[part=location]' );    
    this.$summary = this.shadowRoot.querySelector( 'span[part=summary]' );    
  }

  // When attributes change
  _render() {
    this.$summary.innerText = this.summary === null ? '' : this.summary;
    this.$location.innerText = this.location === null ? '' : this.location;
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
    this._upgrade( 'hidden' );
    this._upgrade( 'location' );         
    this._upgrade( 'selected' );    
    this._upgrade( 'summary' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'location',
      'selected',
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

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
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

window.customElements.define( 'aa-event', AAEvent );
