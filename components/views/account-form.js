customElements.define( 'aa-account-form', class extends HTMLElement {
  constructor() {
    super();

    this.doDemoClick = this.doDemoClick.bind( this );
    this.doExportClick = this.doExportClick.bind( this );
    this.doSignIn = this.doSignIn.bind( this );
    this.doSignUp = this.doSignUp.bind( this );    

    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.$demo = this.querySelector( '#account_cancel' );
    this.$email = this.querySelector( 'aa-input:first-of-type' );
    this.$export = this.querySelector( '#account_export' );
    this.$password = this.querySelector( 'aa-input:last-of-type' );
    this.$signin = this.querySelector( 'form > button:last-of-type' );
    this.$signup = this.querySelector( 'button.signup' );
  }

  focus() {
    this.$email.focus();
  }

  valid() {
    if( this.$email.getAttribute( 'value' ) === null ) {
      return false;
    }

    const email = this.$email.getAttribute( 'value' );
    if( !email.match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ) ) {
      return false;
    }

    if( this.$password.getAttribute( 'value' ) === null ) {
      return false;
    }    

    return true;
  }

  doDemoClick() {
    this.dispatchEvent( new CustomEvent( 'aa-demo', {
      bubbles: true,
      cancelable: false,
      composed: true      
    } ) );
  }

  doExportClick() {
    this.dispatchEvent( new CustomEvent( 'aa-export' ) );
  }

  doSignIn() {
    if( !this.$email.hasAttribute( 'value' ) ) {
      this.$email.focus();
      return;
    }

    const email = this.$email.getAttribute( 'value' );
    if( !email.match( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ) ) {
      this.$email.focus();      
      return;
    }    

    if( !this.$password.hasAttribute( 'value' ) ) {
      this.$password.focus();
      return;
    }

    this.dispatchEvent( new CustomEvent( 'aa-sign-in', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        email: this.$email.getAttribute( 'value' ),
        password: this.$password.getAttribute( 'value' )
      }
    } ) );
  }

  doSignUp() {
    this.dispatchEvent( new CustomEvent( 'aa-sign-up', {
      bubbles: true,
      cancelable: false,
      composed: true
    } ) );
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'data' );

    this.$demo.addEventListener( this._touch, this.doDemoClick );
    this.$export.addEventListener( this._touch, this.doExportClick );
    this.$signin.addEventListener( this._touch, this.doSignIn );
    this.$signup.addEventListener( this._touch, this.doSignUp );
  }

  disconnectedCallback() {
    this.$demo.removeEventListener( this._touch, this.doDemoClick );
    this.$export.removeEventListener( this._touch, this.doExportClick );    
    this.$signin.removeEventListener( this._touch, this.doSignIn );
    this.$signup.removeEventListener( this._touch, this.doSignUp );
  }  

  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value === null ? null : structuredClone( value );

    if( this._data === null ) {
      this.$email.removeAttribute( 'value' );
      this.$password.removeAttribute( 'value' );
    }
  }
} );
