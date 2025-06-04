customElements.define( 'aa-event-details', class extends HTMLElement {
  constructor() {
    super();

    this._calendars = [];
    this._data = null;
    this._daleteAt = null;
    this._timer = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doCloseClick = this.doCloseClick.bind( this );    
    this.doDeleteDown = this.doDeleteDown.bind( this );
    this.doDeleteUp = this.doDeleteUp.bind( this );    
    this.doEditClick = this.doEditClick.bind( this ); 
    this.doFileClick = this.doFileClick.bind( this );     
    this.doSelectChange = this.doSelectChange.bind( this );

    this.$calendar = this.querySelector( 'aa-select' );
    this.$close = this.querySelector( 'div:first-of-type button:first-of-type' );
    this.$delete = this.querySelector( 'button.danger' );
    this.$edit = this.querySelector( '#event_details_edit' );
    this.$ends = this.querySelector( '#event_details_ends' );
    this.$files = this.querySelector( 'ul' );
    this.$location = this.querySelector( '#event_details_location' );
    this.$map = this.querySelector( '#event_details_map' );
    this.$notes = this.querySelector( '#event_details_notes' );
    this.$starts = this.querySelector( '#event_details_starts' );
    this.$title = this.querySelector( '#event_details_title' );
    this.$url = this.querySelector( '#event_details_url' );
  }

  // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  format( bytes, decimals = 2 ) {
    if( !+bytes ) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor( Math.log( bytes ) / Math.log( k ) );

    return `${parseFloat((bytes / Math.pow( k, i ) ).toFixed( dm ) )} ${sizes[i]}`;
  }

  doCloseClick() {
    this.dispatchEvent( new CustomEvent( 'aa-close', {
      detail: {
        id: this._data === null ? null : this._data.id
      }
    } ) );
  }

  doDeleteDown() {
    window.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchend' : 'mouseup', this.doDeleteUp );

    this._deleteAt = Date.now();
    this._timer = setTimeout( () => {
      this.dispatchEvent( new CustomEvent( 'aa-delete', {
        detail: this._data
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

  /*
  doDeleteClick() {
    const response = confirm( 'Are you sure you want to delete this event?' );
    if( !response ) return;    
    this.dispatchEvent( new CustomEvent( 'aa-delete', {
      detail: this._data 
    } ) );
  }
  */

  doEditClick() {
    this.dispatchEvent( new CustomEvent( 'aa-edit', {
      detail: {
        id: this._data.id
      }
    } ) );
  }

  doFileClick( evt ) {
    this.dispatchEvent( new CustomEvent( 'aa-file', {
      detail: {
        id: evt.currentTarget.getAttribute( 'data-id' )
      }
    } ) );
  }

  doSelectChange( evt ) {
    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        id: this._data.id,
        calendarId: evt.detail.value 
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
    this.$calendar.addEventListener( 'aa-change', this.doSelectChange );
    this.$close.addEventListener( this._touch, this.doCloseClick );
    this.$delete.addEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown', this.doDeleteDown );    
    this.$edit.addEventListener( this._touch, this.doEditClick );
    this._upgrade( 'calendars' );
    this._upgrade( 'data' );
  }

  disconnectedCallback() {
    this.$calendar.removeEventListener( 'aa-change', this.doSelectChange );  
    this.$close.removeEventListener( this._touch, this.doCloseClick );
    this.$delete.removeEventListener( ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'mousedown', this.doDeleteDown );        
    this.$edit.removeEventListener( this._touch, this.doEditClick );  
  }  

  get calendars() {
    return this._calendars.length === 0 ? null : this._calendars;
  }

  set calendars( value ) {
    this._calendars = value === null ? [] : [... value];
    this.$calendar.data = this._calendars;
  }
  
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value === null ? null : structuredClone( value );

    // Title
    this.$title.textContent = this._data.summary;

    // Location
    this.$location.textContent = this._data.location;

    if( this._data.location === null ) {
      this.$location.classList.add( 'hidden' );
    } else {
      this.$location.classList.remove( 'hidden' );
    }

    // this.$labelLocation.hidden = this._data.latitude === null ? false : true;
    // this.$linkLocation.label = this._data.location;
    // this.$linkLocation.hidden = this._data.latitude === null ? true : false;    
    // TODO: HREF to Google Maps (lat, lng)

    // Starts/ends
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      weekday: 'long',
      month: 'short',
      year: 'numeric'
    } );      
  
    if( this._data.startsAt.getDate() === this._data.endsAt.getDate() &&
        this._data.startsAt.getMonth() === this._data.endsAt.getMonth() &&
        this._data.startsAt.getFullYear() === this._data.endsAt.getFullYear() ) {
      this.$starts.classList.remove( 'hidden' );
      this.$starts.textContent = formatter.format( this._data.startsAt );
      this.$ends.classList.add( 'hidden' );
    } else {
      this.$starts.classList.remove( 'hidden' );
      this.$starts.textContent = `from ${formatter.format( this._data.startsAt )}`;
      this.$ends.classList.remove( 'hidden' );
      this.$ends.textContent = `to ${formatter.format( this._data.endsAt )}`;
    }

    // Calendar
    this.$calendar.setAttribute( 'selected-item', this._data.calendarId );

    // Attachments
    if( this._data.hasOwnProperty( 'attachments' ) ) {
      if( this._data.attachments === null ) {
        while( this.$files.children.length > 0 ) {
          this.$files.children[0].removeEventListener( this._touch, this.doFileClick );          
          this.$files.children[0].remove();
        }

        this.$files.classList.add( 'hidden' );
      } else {
        while( this.$files.children.length > this._data.attachments.length ) {
          this.$files.children[0].removeEventListener( this._touch, this.doFileClick );                    
          this.$files.children[0].remove();
        }
  
        while( this.$files.children.length < this._data.attachments.length ) {
          const item = document.createElement( 'li' );
          item.addEventListener( this._touch, this.doFileClick );
          
          const icon = document.createElement( 'img' );
          icon.src = './img/file.svg';
          item.appendChild( icon );
  
          const name = document.createElement( 'p' );
          item.appendChild( name );
  
          const size = document.createElement( 'p' );
          item.appendChild( size );
  
          this.$files.appendChild( item );
        }
  
        for( let c = 0; c < this.$files.children.length; c++ ) {
          this.$files.children[c].setAttribute( 'data-id', this._data.attachments[c].id );
          this.$files.children[c].children[1].textContent = this._data.attachments[c].name;
          this.$files.children[c].children[2].textContent = this.format( this._data.attachments[c].size, 2 );
        }

        this.$files.classList.remove( 'hidden' );
      }
    } else {
      this.$files.classList.add( 'hidden' );
    }

    // URL
    if( this._data.url === null ) {
      this.$url.parentElement.classList.add( 'hidden' );
    } else {
      this.$url.parentElement.classList.remove( 'hidden' );
      this.$url.textContent = this._data.url;
      this.$url.href = this._data.url;
    }

    // Notes
    if( this._data.description === null ) {
      this.$notes.parentElement.classList.add( 'hidden' );
    } else {
      this.$notes.parentElement.classList.remove( 'hidden' );
      this.$notes.textContent = this._data.description;      
    }

    // Map
    if( this._data.latitude === null ) {
      this.$map.parentElement.classList.add( 'hidden' );
    } else {
      this.$map.parentElement.classList.remove( 'hidden' );      
    }

    // Delete
    if( this._data.id === null ) {
      this.$delete.classList.add( 'hidden' );
    } else {
      this.$delete.classList.remove( 'hidden' );      
    }

    const last = this.querySelectorAll( 'article .divided:not( .hidden )' );
    for( let c = 0; c < last.length; c++ ) {
      if( c === last.length - 1 ) {
        last[c].classList.add( 'nobottom' );
      } else {
        last[c].classList.remove( 'nobottom' );
      }
    }
  }
} );
