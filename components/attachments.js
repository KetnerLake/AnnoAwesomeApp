customElements.define( 'aa-attachments', class extends HTMLElement {
  constructor() {
    super();

    this._files = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doAddClick = this.doAddClick.bind( this );
    this.doFileRemove = this.doFileRemove.bind( this );    
    this.doInputChange = this.doInputChange.bind( this );

    this.$button = this.querySelector( 'button' );
    this.$input = this.querySelector( 'input' );
    this.$list = this.querySelector( 'ul' );
  }

  doAddClick() {
    this.$input.click();
  }

  doFileRemove( evt ) {
    const id = evt.currentTarget.getAttribute( 'data-id' );
    for( let f = 0; f < this._files.length; f++ ) {
      if( this._files[f].id === id ) {
        this._files.splice( f, 1 );
        break;
      }
    }

    evt.currentTarget.removeEventListener( this._touch, this.doFileRemove );
    evt.currentTarget.parentElement.remove();
  }

  async doInputChange( evt ) {
    const collection = [];
    const now = new Date();

    for( let f = 0; f < evt.target.files.length; f++ ) {
      const size = evt.target.files[f].size / 1000000;

      if( size < 10 ) {
        const found = this._files.filter( ( value ) => value.name === evt.target.files[f].name );
        if( found.length === 0 ) {
          collection.push( {
            id: self.crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            eventId: null,
            name: evt.target.files[f].name,
            size: evt.target.files[f].size,
            type: evt.target.files[f].type,
            data: await evt.target.files[f].arrayBuffer()
          } );
        } else {
          alert( 'Cannot attach the same file more than once.' );
          break;
        }
      } else {
        alert( 'Individual file size limit of 10 Mb.' );
        break;
      }
    }

    this.value = [... this._files, ... collection];
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'value' );        
    this.$button.addEventListener( this._touch, this.doAddClick ); 
    this.$input.addEventListener( 'change', this.doInputChange );         
  }

  disconnectedCallback() {
    this.$button.removeEventListener( this._touch, this.doAddClick ); 
    this.$input.removeEventListener( 'change', this.doInputChange );         
  }  

  get value() {
    return this._files.length === 0 ? null : this._files;
  }

  set value( files ) {
    this._files = files === null ? [] : [... files];
    this._files.sort( ( a, b ) => {
      if( a.name > b.name ) return 1;
      if( a.name < b.name ) return -1;
      return 0;
    } );

    while( this.$list.children.length > this._files.length ) {
      this.$list.children[0].children[2].removeEventListener( this._touch, this.doFileRemove );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._files.length ) {
      const item = document.createElement( 'li' );

      const icon = document.createElement( 'img' );
      icon.classList.add( 'icon' );
      icon.src = './img/file.svg';
      item.appendChild( icon );

      const name = document.createElement( 'p' );
      item.appendChild( name );

      const close = document.createElement( 'button' );
      close.addEventListener( this._touch, this.doFileRemove );
      close.type = 'button';
      close.classList.add( 'icon' );
      item.appendChild( close );

      const img = document.createElement( 'img' );
      img.src = './img/close.svg';
      close.appendChild( img );

      this.$list.appendChild( item );    
    }

    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].children[1].textContent = this._files[c].name;
      this.$list.children[c].children[2].setAttribute( 'data-id', this._files[c].id );      
    }
  }
} );      
