customElements.define( 'aa-search', class extends HTMLElement {
  constructor() {
    super();
    
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doClearClick = this.doClearClick.bind( this );
    this.doInputChange = this.doInputChange.bind( this );

    this.$input = this.querySelector( 'input' );    
    this.$clear = this.querySelector( 'button' );                  
  }

  focus() {
    this.$input.focus();
  }  

  doClearClick() {
    this.setAttribute( 'value', '' );
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
    this.$input.addEventListener( 'keyup', this.doInputChange );                  
    this.$clear.addEventListener( this._touch, this.doClearClick );
  }

  disconnectedCallback() {
    this.$input.removeEventListener( 'keyup', this.doInputChange );
    this.$clear.removeEventListener( this._touch, this.doClearClick );
  }

  static get observedAttributes () {
    return [
      'value'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'value' ) {
      const value = newValue === null ? '' : newValue;
      this.$input.value = value;            
    }
  }        
} );      
