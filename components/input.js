customElements.define( 'aa-input', class extends HTMLElement {
  constructor() {
    super();
    
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doClearClick = this.doClearClick.bind( this );
    this.doEyeClick = this.doEyeClick.bind( this );
    this.doInputChange = this.doInputChange.bind( this );

    this.$clear = this.querySelector( 'button:last-of-type' );    
    this.$input = this.querySelector( 'input' );    

    this.$eye = null;
    if( this.$input.type === 'password' ) {
      this.$eye = this.querySelector( 'button:first-of-type' );
    }    
  }

  focus() {
    this.$input.focus();
  }

  doClearClick() {
    this.removeAttribute( 'value' );
    this.$input.focus();

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      bubbles: true,
      cancelable: false,
      composed: true,        
      detail: {
        value: null
      }
    } ) );            
  }

  doEyeClick( evt ) {
    if( evt.currentTarget.children[0].src.includes( 'eye-fill.svg' ) ) {
      evt.currentTarget.children[0].src = './img/eye-slash-fill.svg';
      this.$input.type = 'password';
    } else {
      evt.currentTarget.children[0].src = './img/eye-fill.svg';
      this.$input.type = 'text';
    }
  }

  doInputChange() {
    const value = this.$input.value.trim().length === 0 ? null : this.$input.value;
    if( value === null ) {
      this.removeAttribute( 'value' );
    } else {
      this.setAttribute( 'value', value );
    }

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        value: value
      }
    } ) );
  }

  connectedCallback() {
    const value = this.getAttribute( 'value' );
    if( value === null ) {
      this.$input.value = '';
    } else {
      this.$input.value = value;
    }

    this.$input.addEventListener( 'keyup', this.doInputChange );                  
    this.$clear.addEventListener( this._touch, this.doClearClick );

    if( this.$eye !== null ) {
      this.$eye.addEventListener( this._touch, this.doEyeClick );
    }
  }

  disconnectedCallback() {
    this.$input.removeEventListener( 'keyup', this.doInputChange );
    this.$clear.removeEventListener( this._touch, this.doClearClick );

    if( this.$eye !== null ) {
      this.$eye.removeEventListener( this._touch, this.doEyeClick );
    }    
  }

  static get observedAttributes () {
    return [
      'value'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'value' ) {
      this.$input.value = newValue;            
    }
  }        
} );      
