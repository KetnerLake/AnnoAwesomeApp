customElements.define( 'aa-navigation', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    this.doAccountClick = this.doAccountClick.bind( this );
    this.doAddClick = this.doAddClick.bind( this );    
    this.doCalendarClick = this.doCalendarClick.bind( this );    
    this.doCancelClick = this.doCancelClick.bind( this );    
    this.doEventClick = this.doEventClick.bind( this );
    this.doSearchFocus = this.doSearchFocus.bind( this );

    this.$account = this.querySelector( 'div:first-of-type button:nth-of-type( 1 )' );
    this.$add = this.querySelector( 'div:first-of-type button:nth-of-type( 4 )' );        
    this.$calendar = this.querySelector( 'div:first-of-type button:nth-of-type( 2 )' );
    this.$cancel = this.querySelector( 'aa-search ~ button' );
    this.$event = this.querySelector( 'div:first-of-type button:nth-of-type( 3 )' );    
    this.$search = this.querySelector( 'aa-search input' );
  }

  doAccountClick() {
    this.dispatchEvent( new CustomEvent( 'aa-account' ) );
  }

  doAddClick() {
    this.dispatchEvent( new CustomEvent( 'aa-add' ) );
  }  

  doCalendarClick() {
    this.$search.value = '';
    this.$cancel.classList.add( 'hidden' );

    if( this.$calendar.classList.contains( 'checked' ) ) {
      this.removeAttribute( 'mode' );
    } else {
      this.setAttribute( 'mode', 'calendar' );
    }

    this.dispatchEvent( new CustomEvent( 'aa-calendar', {
      detail: {
        calendar: this.$calendar.classList.contains( 'checked' ),
        event: this.$event.classList.contains( 'checked' )
      }
    } ) );
  }  

  doCancelClick() {
    this.$search.value = null;
    this.$cancel.classList.add( 'hidden' );

    this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );    
  }

  doEventClick() {
    this.$search.value = '';
    this.$cancel.classList.add( 'hidden' );

    if( this.$event.classList.contains( 'checked' ) ) {
      this.removeAttribute( 'mode' )
    } else {
      this.setAttribute( 'mode', 'event' );
    }

    this.dispatchEvent( new CustomEvent( 'aa-event', {
      detail: {
        calendar: this.$calendar.classList.contains( 'checked' ),
        event: this.$event.classList.contains( 'checked' )
      }
    } ) );
  }  

  doSearchFocus() {
    this.$calendar.classList.remove( 'checked' );
    this.$event.classList.remove( 'checked' );
    this.$cancel.classList.remove( 'hidden' );
    this.dispatchEvent( new CustomEvent( 'aa-search' ) );
  }

  connectedCallback() {
    this.$account.addEventListener( this._touch, this.doAccountClick );    
    this.$calendar.addEventListener( this._touch, this.doCalendarClick );    
    this.$event.addEventListener( this._touch, this.doEventClick );    
    this.$add.addEventListener( this._touch, this.doAddClick );    
    this.$search.addEventListener( 'focus', this.doSearchFocus );
    this.$cancel.addEventListener( this._touch, this.doCancelClick );
  }

  disconnectedCallback() {
    this.$account.removeEventListener( this._touch, this.doAccountClick );    
    this.$calendar.removeEventListener( this._touch, this.doCalendarClick );    
    this.$event.removeEventListener( this._touch, this.doEventClick );    
    this.$add.removeEventListener( this._touch, this.doAddClick );   
    this.$search.removeEventListener( 'focus', this.doSearchFocus );
    this.$cancel.removeEventListener( this._touch, this.doCancelClick );     
  }

  static get observedAttributes () {
    return [
      'disabled',
      'mode'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'disabled' ) {
      const disabled = this.hasAttribute( 'disabled' );
      this.$account.disabled = disabled;
      this.$calendar.disabled = disabled;
      this.$event.disabled = disabled;
      this.$add.disabled = disabled;      
    }

    if( name === 'mode' ) {
      if( this.hasAttribute( 'mode' ) ) {
        if( this.getAttribute( 'mode' ) === 'calendar' ) {
          this.$calendar.classList.add( 'checked' );      
          this.$event.classList.remove( 'checked' );                     
        } else if( this.getAttribute( 'mode' ) === 'event' ) {
          this.$calendar.classList.remove( 'checked' );      
          this.$event.classList.add( 'checked' );                     
        }
      } else {
        this.$calendar.classList.remove( 'checked' );      
        this.$event.classList.remove( 'checked' );              
      }
    }
  }  
} );
