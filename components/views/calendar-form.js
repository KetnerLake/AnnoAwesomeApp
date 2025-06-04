customElements.define( 'aa-calendar-form', class extends HTMLElement {
  constructor() {
    super();

    this._colors = [];
    this._data = null;
    this._deleteAt = null;
    this._timer = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doCancelClick = this.doCancelClick.bind( this );
    this.doColorClick = this.doColorClick.bind( this );
    this.doCopyClick = this.doCopyClick.bind( this );    
    this.doDeleteDown = this.doDeleteDown.bind( this );
    this.doDeleteUp = this.doDeleteUp.bind( this );    
    this.doDoneClick = this.doDoneClick.bind( this );
    this.doExportClick = this.doExportClick.bind( this );
    this.doNameChange = this.doNameChange.bind( this );
    this.doPublicClick = this.doPublicClick.bind( this );
    this.doShareClick = this.doShareClick.bind( this );    

    this.$cancel = this.querySelector( '#calendar_form_cancel' );
    this.$colors = this.querySelector( 'summary' );
    this.$copy = this.querySelector( '#calendar_url button' );
    this.$delete = this.querySelector( '#calendar_form_delete' );
    this.$details = this.querySelector( 'details' );
    this.$done = this.querySelector( '#calendar_form_done' );
    this.$export = this.querySelector( '#calendar_form_export' );
    this.$list = this.querySelector( 'details ul' );
    this.$name = this.querySelector( '#calendar_form_name' );
    this.$public = this.querySelector( '#calendar_form_public' );
    this.$share = this.querySelector( '#calendar_form_share' );    
    this.$template = document.querySelector( '#color_picker_renderer' );
    this.$title = this.querySelector( '#calendar_form_title' );
    this.$url = this.querySelector( '#calendar_url p:last-of-type' );
  }

  focus() {
    this.$name.focus();
  }

  validate() {
    let result = true;

    if( !this.$name.hasAttribute( 'value' ) ) {
      result = false;
    }

    return result;
  }

  async tiny( value ) {
    const encoder = new TextEncoder();
    const data = encoder.encode( value );
    const buffer = await window.crypto.subtle.digest( 'SHA-1', data );
    const hashArray = Array.from( new Uint8Array( buffer) );
    const hashHex = hashArray.map( ( byte ) => byte.toString( 16 ).padStart( 2, '0' ) ).join( '' );
    const shortHexDigest = hashHex.substring( 0, 6 );          

    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';        
    let randomInt = Math.floor( Math.random() * Math.pow( 62, 6 ) );
    let converted = '';

    while( randomInt > 0 ) {
      const digit = randomInt % 62;
      converted = alphabet[digit] + converted;
      randomInt = Math.floor( randomInt / 62 );
    }

    return converted.substring( 0, 2 ) + shortHexDigest;
  }

  doCancelClick() {
    this.dispatchEvent( new CustomEvent( 'aa-cancel', {
      bubbles: true,
      cancelable: true,
      composed: true
    } ) );
  }

  doColorClick( evt ) {
    const color = evt.currentTarget.getAttribute( 'data-color' );    
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    const name = evt.currentTarget.getAttribute( 'data-name' );

    this.$colors.setAttribute( 'data-color', color );
    this.$colors.children[0].style.backgroundColor = color;
    this.$colors.children[1].textContent = name;

    for( let c = 0; c < this.$list.children.length; c++ ) {
      if( c === index ) {
        this.$list.children[c].classList.add( 'selected' );
      } else {
        this.$list.children[c].classList.remove( 'selected' );        
      }
    }

    this.dispatchEvent( new CustomEvent( 'aa-color', {
      detail: {
        name: name,
        value: color
      }
    } ) );

    this.$done.disabled = !this.validate();
  }

  doCopyClick() {
    navigator.clipboard.writeText( `https://annoawesome.com/app?calendar=${this._data.url}` );
  }

  doDeleteDown() {
    window.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchend' : 'mouseup', this.doDeleteUp );

    this._deleteAt = Date.now();
    this._timer = setTimeout( () => {
      this.dispatchEvent( new CustomEvent( 'aa-delete', {
        detail: {
          id: this._data.id
        }
      } ) );
    }, 2000 );
  }

  doDeleteUp() {
    if( this._deleteAt !== null ) {
      if( this._timer !== null ) {
        clearTimeout( this._timer );
        this._timer = null;
      }

      window.removeEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchend' : 'mouseup', this.doDeleteUp );      
      this._deleteAt = null;
    }
  }

  doDoneClick() {
    this.dispatchEvent( new CustomEvent( 'aa-done' ) );
  }

  doExportClick() {
    this.dispatchEvent( new CustomEvent( 'aa-export', {
      detail: {
        id: this._data.id
      }
    } ) );
  }

  doNameChange( evt ) {
    this.$done.disabled = !this.validate();
  }

  doPublicClick() {
    this.$done.disabled = !this.validate();    
  }

  doShareClick() {
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
    this.$cancel.addEventListener( this._touch, this.doCancelClick );        
    this.$copy.addEventListener( this._touch, this.doCopyClick );        
    this.$delete.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown', this.doDeleteDown );
    this.$done.addEventListener( this._touch, this.doDoneClick );
    this.$export.addEventListener( this._touch, this.doExportClick );
    this.$name.addEventListener( 'aa-change', this.doNameChange );
    this.$share.addEventListener( this._touch, this.doShareClick );
    this.$public.addEventListener( this._touch, this.doPublicClick );
    this._upgrade( 'colors' );    
    this._upgrade( 'data' );
  }

  disconnectedCallback() {
    this.$cancel.removeEventListener( this._touch, this.doCancelClick );
    this.$copy.removeEventListener( this._touch, this.doCopyClick );            
    this.$delete.removeEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown', this.doDeleteDown );    
    this.$done.removeEventListener( this._touch, this.doDoneClick );    
    this.$export.removeEventListener( this._touch, this.doExportClick );    
    this.$name.removeEventListener( 'aa-change', this.doNameChange );
    this.$share.removeEventListener( this._touch, this.doShareClick );
    this.$public.removeEventListener( this._touch, this.doPublicClick );    
  }

  static get observedAttributes () {
    return [
      'can-delete'
    ];
  }   

  get colors() {
    return this._colors.length === 0 ? null : this._colors;
  }

  set colors( value ) {
    this._colors = value === null ? [] : [... value];

    while( this.$list.children.length > this._colors.length ) {
      this.$list.children[0].removeEventListener( this._touch, this.doColorClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._colors.length ) {
      const clone = this.$template.content.cloneNode( true );
      this.$list.appendChild( clone );
      this.$list.children[this.$list.children.length - 1].addEventListener( this._touch, this.doColorClick );
    }              

    let index = this.getAttribute( 'selected-index' );
    index = index === null ? 0 : parseInt( index );

    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].setAttribute( 'data-index', c );      
      this.$list.children[c].setAttribute( 'data-color', this._colors[c].value );
      this.$list.children[c].setAttribute( 'data-name', this._colors[c].name );            

      const circle = this.$list.children[c].querySelector( 'div' );
      circle.style.backgroundColor = this._colors[c].value;

      const name = this.$list.children[c].querySelector( 'p' );
      name.textContent = this._colors[c].name;

      if( c === index ) {
        this.$list.children[c].classList.add( 'selected' );
      } else {
        this.$list.children[c].classList.remove( 'selected' );        
      }
    }    

    this.$colors.setAttribute( 'data-color', this._colors[index].value );
  }

  get data() {
    const id = this._data === null ? self.crypto.randomUUID() : this._data.id;
    const now = new Date();

    return {
      id: id,
      createdAt: this._data === null ? now : this._data.createdAt,
      updatedAt: now,
      name: this.$name.getAttribute( 'value' ) === null ? null : this.$name.getAttribute( 'value' ),
      color: this.$colors.getAttribute( 'data-color' ),
      isShared: false,
      isPublic: this.$public.checked,
      url: this.$url.textContent,
      isActive: this._data === null ? true : this._data.isActive
    };    
  }

  set data( value ) {
    this._data = value === null ? null : structuredClone( value );

    if( this._data === null ) {
      const color = this._colors.find( ( value ) => value.name === 'Blue' ? true : false );

      this.$title.textContent = 'Add Calendar';
      this.$done.disabled = true;
      this.$name.removeAttribute( 'value' );
      this.$details.removeAttribute( 'open' );
      this.$colors.setAttribute( 'data-color', color.value );
      this.$details.children[0].children[0].style.backgroundColor = color.value;
      this.$details.children[0].children[1].textContent = color.name;
      
      for( let c = 0; c < this.$list.children.length; c++ ) {
        if( this._colors[c].name === 'Blue' ) {
          this.$list.children[c].classList.add( 'selected' );
        } else {
          this.$list.children[c].classList.remove( 'selected' );
        }
      }
      
      this.$public.checked = false;
      this.tiny().then( ( data ) => this.$url.textContent = data );
      this.$export.classList.add( 'hidden' );
    } else {
      const color = this._colors.find( ( value ) => value.value === this._data.color ? true : false );

      this.$title.textContent = 'Edit Calendar';
      this.$done.disabled = true;
      this.$name.setAttribute( 'value', this._data.name );
      this.$details.removeAttribute( 'open' );
      this.$colors.setAttribute( 'data-color', color.value );
      this.$details.children[0].children[0].style.backgroundColor = color.value;
      this.$details.children[0].children[1].textContent = color.name;
      
      for( let c = 0; c < this.$list.children.length; c++ ) {
        if( this._colors[c].value === this._data.color ) {
          this.$list.children[c].classList.add( 'selected' );
        } else {
          this.$list.children[c].classList.remove( 'selected' );
        }
      }      

      this.$public.checked = this._data.isPublic;
      this.$url.textContent = this._data.url;      
      this.$export.classList.remove( 'hidden' );      
    }
  }
} );
