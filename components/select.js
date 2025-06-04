customElements.define( 'aa-select', class extends HTMLElement {
  constructor() {
    super();
    
    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doSelectChange = this.doSelectChange.bind( this );

    this.$color = this.querySelector( 'div' );
    this.$label = this.querySelector( 'p:last-of-type' );
    this.$select = this.querySelector( 'select' );    
  }

  focus() {
    this.$select.focus();
  }  

  doSelectChange() {
    let color = this.getAttribute( 'color-field' );
    color = color === null ? 'color' : color;

    this.$color.style.backgroundColor = this._data[this.$select.selectedIndex][color];
    this.$label.textContent = this.$select.selectedOptions[0].innerText;
    this.setAttribute( 'selected-item', this.$select.value );

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        value: this.$select.value
      }
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
    this.$select.addEventListener( 'change', this.doSelectChange );                  
  }

  disconnectedCallback() {
    this.$select.removeEventListener( 'change', this.doSelectChange );                      
  }

  static get observedAttributes () {
    return [
      'color-field',      
      'label-field',
      'selected-item',      
      'value-field'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'selected-item' ) {
      if( this.hasAttribute( 'selected-item' ) ) {
        this.$select.value = newValue;
      } else {
        this.$select.selectedIndex = 0;
      }

      this.$color.style.backgroundColor = this._data[this.$select.selectedIndex].color;
      this.$label.textContent = this.$select.selectedOptions[0].textContent;      
    }
  }  

  get data() {
    return this._data.length === 0 ? null : this._data;
  }  

  set data( value ) {
    this._data = value === null ? [] : [... value];

    while( this.$select.children.length > this._data.length ) {
      this.$select.children[0].remove();
    }

    while( this.$select.children.length < this._data.length ) {
      const option = document.createElement( 'option' );
      this.$select.appendChild( option );
    }

    let color = this.getAttribute( 'color-field' );
    color = color === null ? 'color' : color;

    let label = this.getAttribute( 'label-field' );
    label = label === null ? 'label' : label;

    let field = this.getAttribute( 'value-field' );
    field = field === null ? 'value' : field;

    for( let c = 0; c < this.$select.children.length; c++ ) {
      this.$select.children[c].textContent = this._data[c][label];
      this.$select.children[c].value = this._data[c][field];
    }

    this.setAttribute( 'selected-item', this._data[0][field] );

    if( this._data.length > 0 ) {
      this.$color.style.backgroundColor = this._data[this.$select.selectedIndex][color];
      this.$label.textContent = this.$select.selectedOptions[0].innerText;    
    }
  }
} );      
