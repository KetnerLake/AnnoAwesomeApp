export default class AAAccountForm extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-button[part=demo] {
          --button-text-align: center;
        }

        aa-button[part=pin] {
          --button-text-align: center;          
        }

        aa-hbox[part=status] {
          height: 36px; 
          padding: 0 16px 0 16px;          
        }

        aa-hbox[part=status] aa-label:first-of-type {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-hbox aa-label:last-of-type {     
          --label-color: #9e9e9e;             
        }

        aa-icon {
          --icon-cursor: pointer;
        }

        aa-label[part=pin] {
          --label-cursor: pointer; 
          --label-line-height: 21px          
        }

        button[part=signup] {
          background: none;
          background-color: #0082ff; 
          border: none;
          border-bottom-left-radius: 4px; 
          border-bottom-right-radius: 4px;  
          border-top-left-radius: 0; 
          border-top-right-radius: 0;  
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: auto;
          gap: 16px; 
          padding: 16px;           
        }

        button[part=signup] aa-label {
          --label-cursor: pointer;
        }
      </style>
      <aa-section>
        <aa-input autofocus part="email" placeholder="Email address"></aa-input>
        <aa-divider></aa-divider>
        <aa-input part="password" placeholder="Password" type="password"></aa-input>
        <aa-divider></aa-divider>
        <aa-button label="Sign in" part="signin"></aa-button>
      </aa-section>
      <aa-section>
        <aa-hbox centered part="status">
          <aa-label text="Account status"></aa-label>
          <aa-label text="Free"></aa-label>
        </aa-hbox>
        <button part="signup" type="button">
          <img src="./img/trident.svg" height="32" width="32" />  
          <aa-vbox>
            <aa-hbox gap="s">
              <aa-label inverted part="hook" text="Get more awesome" weight="bold"></aa-label>
              <aa-icon inverted src="./img/arrow-right.svg"></aa-icon>
            </aa-hbox>
            <aa-label balanced inverted part="pin" text="Sync across devices, share privately or publicly, add attachments, location lookup, and more..."></aa-label>
          </aa-vbox>
        </button>
      </aa-section>
      <aa-section>
        <aa-button label="Just checking it out" part="demo"></aa-button>
      </aa-section>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$demo = this.shadowRoot.querySelector( 'aa-button[part=demo]' );
    this.$demo.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-demo' ) );
    } );
    this.$email = this.shadowRoot.querySelector( 'aa-input[part=email]' );
    this.$password = this.shadowRoot.querySelector( 'aa-input[part=password]' );
    this.$signin = this.shadowRoot.querySelector( 'aa-button[part=signin]' );
    this.$signin.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      if( this.$email.value === null ) {
        this.$email.focus();
        return;
      }

      if( this.$password.value === null ) {
        this.$password.focus();
        return;
      }

      this.dispatchEvent( new CustomEvent( 'aa-signin', {
        detail: {
          email: this.$email.value,
          password: this.$password.value
        }
      } ) );
    } );
    this.$signup = this.shadowRoot.querySelector( 'button[part=signup]' );    
  }

  focus() {
    this.$email.focus();
  }

  reset() {
    this._data = null;

    this.$email.value = null;
    this.$password.value = null;
  }

  validate() {
    let valid = true;

    if( this.$email.value === null ) valid = false;
    if( this.$password.value === null ) valid = false;    

    return valid;
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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

window.customElements.define( 'aa-account-form', AAAccountForm );
