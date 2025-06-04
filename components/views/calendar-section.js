customElements.define( 'aa-calendar-section', class extends HTMLElement {
  constructor() {
    super();

    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doActiveClick = this.doActiveClick.bind( this );
    this.doHideClick = this.doHideClick.bind( this );
    this.doInfoClick = this.doInfoClick.bind( this );

    this.$hide = this.querySelector( 'button' );
    this.$label = this.querySelector( 'h3' );
    this.$list = this.querySelector( 'ul' );
    this.$template = document.querySelector( '#calendar_list_renderer' );
  }

  doActiveClick( evt ) {
    this.dispatchEvent( new CustomEvent( 'aa-active', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        active: evt.target.checked,
        id: evt.target.getAttribute( 'data-id' )
      }
    } ) );
  }

  doHideClick() {
    this.dispatchEvent( new CustomEvent( 'aa-active', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        active: this.$hide.textContent === 'Hide All' ? false : true,
        calendars: this._data.reduce( ( prev, curr ) => {
          prev.push( curr.id );
          return prev;
        }, [] )
      }
    } ) );
  }

  doInfoClick( evt ) {
    this.dispatchEvent( new CustomEvent( 'aa-info', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        id: evt.currentTarget.getAttribute( 'data-id' )
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
    this.$hide.addEventListener( this._touch, this.doHideClick );    
    this._upgrade( 'data' );
  }

  disconnectedCallback() {
    this.$hide.removeEventListener( this._touch, this.doHideClick );    
  }

  static get observedAttributes () {
    return [
      'label'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'label' ) {
      this.$label.textContent = newValue;
    }
  }

  get data() {
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    const active = this._data.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );    
    this.$hide.textContent = active ? 'Hide All' : 'Show All';    

    while( this.$list.children.length > this._data.length ) {
      const checkbox = this.$list.children[0].querySelector( 'input' );
      checkbox.removeEventListener( 'change', this.doActiveClick );

      const info = this.$list.children[0].querySelector( 'button' );
      info.removeEventListener( this._touch, this.doInfoClick );

      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const clone = this.$template.content.cloneNode( true );
      this.$list.appendChild( clone );

      const index = this.$list.children.length - 1;

      const checkbox = this.$list.children[index].querySelector( 'input' );
      checkbox.addEventListener( 'change', this.doActiveClick );
    }          

    for( let c = 0; c < this.$list.children.length; c++ ) {
      const checkbox = this.$list.children[c].querySelector( 'input' );
      checkbox.setAttribute( 'data-id', this._data[c].id );
      checkbox.checked = this._data[c].isActive;
      checkbox.style.borderColor = this._data[c].color;
      checkbox.nextElementSibling.style.fill = this._data[c].color;
      checkbox.addEventListener( 'change', this.doActiveClick );

      const label = this.$list.children[c].querySelector( 'p' );
      label.textContent = this._data[c].name;

      const info = this.$list.children[c].querySelector( 'button' );
      info.setAttribute( 'data-id', this._data[c].id );
      info.removeEventListener( this._touch, this.doInfoClick );            
      info.addEventListener( this._touch, this.doInfoClick );      
    }
  }
} );
