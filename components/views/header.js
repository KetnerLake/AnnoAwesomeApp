customElements.define( 'aa-header', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doNextClick = this.doNextClick.bind( this );
    this.doPreviousClick = this.doPreviousClick.bind( this );
    this.doTodayClick = this.doTodayClick.bind( this );
    this.doYearClick = this.doYearClick.bind( this );

    this.$next = this.querySelector( 'button:nth-of-type( 3 )' );
    this.$previous = this.querySelector( 'button:nth-of-type( 1 )' );
    this.$today = this.querySelector( 'button:nth-of-type( 2 )' );
    this.$year = this.querySelector( 'h3' );
  }

  doNextClick() {
    let year = this.getAttribute( 'year' );
    year = year === null ? new Date().getFullYear() : parseInt( year );
    year = year + 1;
    this.setAttribute( 'year', year );    

    this.dispatchEvent( new CustomEvent( 'aa-next', {
      detail: {
        starts: new Date( year, 0, 1 ),
        ends: new Date( year + 1, 0, 1 ),        
        year: year
      }
    } ) );
  }

  doPreviousClick() {
    let year = this.getAttribute( 'year' );
    year = year === null ? new Date().getFullYear() : parseInt( year );
    year = year - 1;
    this.setAttribute( 'year', year );

    this.dispatchEvent( new CustomEvent( 'aa-previous', {
      detail: {
        starts: new Date( year, 0, 1 ),
        ends: new Date( year + 1, 0, 1 ),        
        year: year
      }
    } ) );
  }

  doTodayClick() {
    const year = new Date().getFullYear();
    this.setAttribute( 'year', year );

    this.dispatchEvent( new CustomEvent( 'aa-today', {
      detail: {
        starts: new Date( year, 0, 1 ),
        ends: new Date( year + 1, 0, 1 ),        
        year: year
      }
    } ) );
  }

  doYearClick() {
    this.dispatchEvent( new CustomEvent( 'aa-year' ) );
  }

  connectedCallback() {
    this.$previous.addEventListener( this._touch, this.doPreviousClick );
    this.$today.addEventListener( this._touch, this.doTodayClick );
    this.$next.addEventListener( this._touch, this.doNextClick );
    this.$year.addEventListener( this._touch, this.doYearClick );
  }

  disconnectedCallback() {
    this.$previous.removeEventListener( this._touch, this.doPreviousClick );
    this.$today.removeEventListener( this._touch, this.doTodayClick );
    this.$next.removeEventListener( this._touch, this.doNextClick );
    this.$year.removeEventListener( this._touch, this.doYearClick );    
  }

  static get observedAttributes () {
    return [
      'disabled',
      'year'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'disabled' ) {
      const disabled = this.hasAttribute( 'disabled' );
      this.$previous.disabled = disabled;
      this.$today.disabled = disabled;
      this.$next.disabled = disabled;
    }

    if( name === 'year' ) {
      const year = newValue === null ? new Date().getFullYear() : newValue;
      this.$year.textContent = year;
    }
  }
} );
