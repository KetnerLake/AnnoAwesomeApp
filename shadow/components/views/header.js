export default class AAHeader extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr; 
          grid-template-rows: 1fr; 
          gap: 0px 0px;            
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        aa-button {
          --button-padding: 0;          
        }

        aa-hbox {
          grid-column: 3 / 3; 
          justify-self: end;
        }
      </style>
      <aa-label part="year" size="xl" weight="bold"></aa-label>        
      <aa-hbox centered gap="l">
        <aa-icon-button part="previous" size="s" src="./img/chevron-left.svg"></aa-icon-button>          
        <aa-button label="Today" part="today"></aa-button>
        <aa-icon-button part="next" size="s" src="./img/chevron-right.svg"></aa-icon-button>                    
      </aa-hbox>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$next = this.shadowRoot.querySelector( 'aa-icon-button[part=next]' );
    this.$next.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.year = this.year === null ? new Date().getFullYear() : this.year + 1;
      this.dispatchEvent( new CustomEvent( 'aa-next', {
        detail: {
          starts: new Date( this.year, 0, 1 ),
          ends: new Date( this.year + 1, 0, 1 ),
          year: this.year
        }
      } ) );
    } );
    this.$previous = this.shadowRoot.querySelector( 'aa-icon-button[part=previous]' );
    this.$previous.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.year = this.year === null ? new Date().getFullYear() : this.year - 1;
      this.dispatchEvent( new CustomEvent( 'aa-previous', {
        detail: {
          starts: new Date( this.year, 0, 1 ),
          ends: new Date( this.year + 1, 0, 1 ),
          year: this.year
        }
      } ) );
    } );    
    this.$today = this.shadowRoot.querySelector( 'aa-button[part=today]' );
    this.$today.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.year = new Date().getFullYear();
      this.dispatchEvent( new CustomEvent( 'aa-today', {
        detail: {
          starts: new Date( this.year, 0, 1 ),
          ends: new Date( this.year + 1, 0, 1 ),
          year: this.year
        }
      } ) );
    } );
    this.$year = this.shadowRoot.querySelector( 'aa-label[part=year]' );
  }

  // When things change
  _render() {
    const year = this.year === null ? new Date().getFullYear() : this.year;

    this.$next.disabled = this.disabled;
    this.$previous.disabled = this.disabled;
    this.$today.disabled = this.disabled;
    this.$year.text = year;
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
    this._upgrade( 'year' );                              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'year'
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
    this._data = value === null ? null : structuredClone( value );
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

  get year() {
    if( this.hasAttribute( 'year' ) ) {
      return parseInt( this.getAttribute( 'year' ) );
    }

    return null;
  }

  set year( value ) {
    if( value !== null ) {
      this.setAttribute( 'year', value );
    } else {
      this.removeAttribute( 'year' );
    }
  }         
}

window.customElements.define( 'aa-header', AAHeader );
