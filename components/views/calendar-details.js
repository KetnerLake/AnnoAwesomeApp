customElements.define( 'aa-calendar-details', class extends HTMLElement {
  constructor() {
    super();

    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doAddClick = this.doAddClick.bind( this );
    this.doColorsClick = this.doColorsClick.bind( this );
    this.doHideClick = this.doHideClick.bind( this );

    this.$add = this.querySelector( '#calendar_details_add' );
    this.$colors = this.querySelector( '#calendar_colors' );
    this.$hide = this.querySelector( '#calendar_details_hide' );
    this.$mine = this.querySelector( 'aa-calendar-section:nth-of-type( 1 )' );
    this.$shared = this.querySelector( 'aa-calendar-section:nth-of-type( 2 )' );    
    this.$public = this.querySelector( 'aa-calendar-section:nth-of-type( 3 )' );
    this.$small = this.querySelector( 'small' );
  }

  doAddClick() {
    this.dispatchEvent( new CustomEvent( 'aa-add' ) );
  }

  doColorsClick( evt ) {
    if( evt.target.checked ) {
      this.setAttribute( 'use-calendar-color', '' );
    } else {
      this.removeAttribute( 'use-calendar-color' );
    }

    this.dispatchEvent( new CustomEvent( 'aa-colors', {
      detail: {
        checked: evt.target.checked
      }
    } ) );
  }

  doHideClick() {
    this.dispatchEvent( new CustomEvent( 'aa-active', {
      detail: {
        active: this.$hide.textContent === 'Hide All' ? false : true,
        calendars: this._data.reduce( ( prev, curr ) => {
          prev.push( curr.id );
          return prev;
        }, [] )
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
    this.$add.addEventListener( this._touch, this.doAddClick );
    this.$colors.addEventListener( 'change', this.doColorsClick );
    this.$hide.addEventListener( this._touch, this.doHideClick );    
    this._upgrade( 'data' );
  }

  disconnectedCallback() {
    this.$add.removeEventListener( this._touch, this.doAddClick );    
    this.$colors.removeEventListener( 'change', this.doColorsClick );  
    this.$hide.removeEventListener( this._touch, this.doHideClick );          
  }

  static get observedAttributes() {
    return [
      'use-calendar-color'
    ];
  }

  attributeChangedCallback( name, old, value ) {
    if( name === 'use-calendar-color' ) {
      if( this.hasAttribute( 'use-calendar-color' ) ) {
        this.$colors.children[0].checked = true;
      } else {
        this.$colors.children[0].checked = false;        
      }
    }
  }  

  get data() {
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    const mine = this._data.filter( ( value ) => ( value.isShared || value.isPublic ) ? false : true );
    const mine_active = mine.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );

    const shared = this._data.filter( ( value ) => value.isShared );    
    const shared_active = shared.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );

    const publicly = this._data.filter( ( value ) => value.isPublic );
    const public_active = publicly.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );    

    this.$mine.data = mine;
    this.$shared.data = shared;
    this.$public.data = publicly;

    this.$small.style.display = shared.length > 0 || publicly.length > 0 ? 'block' : 'none';

    if( mine_active === false || shared_active === false || public_active === false ) {
      this.$hide.textContent = 'Show All';
    } else {
      this.$hide.textContent = 'Hide All';
    }    
  }
} );
