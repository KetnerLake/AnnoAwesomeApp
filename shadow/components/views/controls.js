export default class AAControls extends HTMLElement {
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
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        aa-button[part=cancel] {
          --button-padding: 0;
        }

        aa-hbox:last-of-type {
          justify-self: end; 
          grid-column: 3 / 3;
        }

        aa-icon[part=sync] {
          padding: 8px;
        }

        aa-icon-button[part=wizard] {
          opacity: 0;
        }
       </style>
      <aa-hbox centered gap="m">
        <aa-icon-button part="account" src="./img/account.svg"></aa-icon-button>
        <aa-icon-button hidden part="share" src="./img/share.svg"></aa-icon-button>
        <aa-icon-button part="calendars" src="./img/calendar.svg"></aa-icon-button>
        <aa-icon-button part="list" src="./img/list.svg"></aa-icon-button>                        
        <aa-icon-button part="add" src="./img/add.svg"></aa-icon-button>                                
        <aa-icon hidden part="sync" src="./img/cloud-upload.svg"></aa-icon>                                
        <aa-icon-button part="wizard"></aa-icon-button>                                        
      </aa-hbox>
      <aa-hbox gap="l">
        <aa-search part="search"></aa-search>
        <aa-button hidden label="Cancel" part="cancel"></aa-button> 
      </aa-hbox>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$account = this.shadowRoot.querySelector( 'aa-icon-button[part=account]' );
    this.$account.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$search.value = null;
      this.$cancel.hidden = true;
      this.dispatchEvent( new CustomEvent( 'aa-account' ) );
    } );
    this.$add = this.shadowRoot.querySelector( 'aa-icon-button[part=add]' );
    this.$add.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$search.value = null;
      this.$cancel.hidden = true;      
      this.dispatchEvent( new CustomEvent( 'aa-add' ) );
    } );
    this.$calendars = this.shadowRoot.querySelector( 'aa-icon-button[part=calendars]' );
    this.$calendars.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$search.value = null;
      this.$cancel.hidden = true;

      this.$calendars.checked = !this.$calendars.checked;
      this.$list.checked = false;


      this.dispatchEvent( new CustomEvent( 'aa-calendars', {
        detail: {
          calendars: this.$calendars.checked,
          list: this.$list.checked
        }
      } ) );
    } );
    this.$cancel = this.shadowRoot.querySelector( 'aa-button[part=cancel]' );
    this.$cancel.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$search.value = null;
      this.$cancel.hidden = true;      

      this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );
    } );
    this.$list = this.shadowRoot.querySelector( 'aa-icon-button[part=list]' );
    this.$list.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$search.value = null;
      this.$cancel.hidden = true;

      this.$list.checked = !this.$list.checked;
      this.$calendars.checked = false;

      this.dispatchEvent( new CustomEvent( 'aa-list', {
        detail: {
          calendars: this.$calendars.checked,
          list: this.$list.checked
        }
      } ) );
    } );
    this.$search = this.shadowRoot.querySelector( 'aa-search[part=search]' );
    this.$search.addEventListener( 'focus', ( evt ) => {
      evt.preventDefault();
      this.$cancel.hidden = false;
      this.dispatchEvent( new CustomEvent( 'aa-search', {
        detail: {
          value: this.$search.value
        }
      } ) );
    } );
    this.$wizard = this.shadowRoot.querySelector( 'aa-icon-button[part=wizard]' );
    this.$wizard.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-wizard' ) );
    } );
  }

  // When things change
  _render() {
    this.$account.disabled = this.disabled;
    this.$add.disabled = this.disabled;
    this.$calendars.disabled = this.disabled;
    this.$cancel.disabled = this.disabled;
    this.$list.disabled = this.disabled;
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

window.customElements.define( 'aa-controls', AAControls );
