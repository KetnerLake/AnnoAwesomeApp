customElements.define( 'aa-event-button', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doButtonClick = this.doButtonClick.bind( this );

    this.innerHTML =
    `<button type="button">
       <span></span>
       <span></span>
     </button>`;

    this.$label = this.querySelector( 'span:first-of-type' );
    this.$location = this.querySelector( 'span:last-of-type' );
  }

  doButtonClick( evt ) {;}

  connectedCallback() {
    // this.$vertical.addEventListener( this._touch, this.doScaleClick );
  }

  disconnectedCallback() {
    // this.$vertical.removeEventListener( this._touch, this.doScaleClick );
  }

  static get observedAttributes () {
    return [
      'label',
      'location'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'label' ) {      
      if( this.hasAttribute( 'label' ) ) {
        this.$label.textContent = newValue;
      } else {
        this.$label.textContent = '';
      }
    }

    if( name === 'location' ) {      
      if( this.hasAttribute( 'location' ) ) {
        this.$location.textContent = newValue;
      } else {
        this.$location.textContent = '';
      }
    }    
  }
} );
