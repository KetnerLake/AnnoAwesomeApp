import AAIcon from "./icon.js";

export default class AASlider extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-icon::part( icon ) {
          cursor: pointer;
        }

        div[part=bar] {
          background-color: #e9e9e9;          
          border-radius: 5px;
          cursor: pointer;
          width: 126px;  
        }

        div[part=fill] {
          background: #0082ff;           
          border-radius: 5px;          
          cursor: pointer;
          height: 5px;           
          transition: background 0.25s linear;
        }

        button[part=handle] {
          appearance: none;
          background: none;
          background: #ffffff;
          border: none;
          border-radius: 22px;
          box-shadow: 0 0 5px rgba( 0, 0, 0, 0.50 );
          box-sizing: border-box;
          cursor: pointer;
          height: 22px;
          margin: 0;
          outline: none;
          padding: 0;
          position: absolute;
          width: 22px;
          -webkit-tap-highlight-color: transparent;                      
        }

        :host( [disabled] ) aa-icon::part( icon ),
        :host( [disabled] ) div[part=bar],
        :host( [disabled] ) button[part=handle] {
          cursor: not-allowed;
        }
        
        :host( [disabled] ) div[part=fill] {
          background: #b0b0b0;
        }
      </style>
      <aa-icon name="remove" size="21" weight="300"></aa-icon>
      <div part="bar">
        <div part="fill"></div>
      </div>
      <button part="handle" type="button"></button>
      <aa-icon name="add" size="21" weight="300"></aa-icon>
    `;

    // Private
    this._bounds = null;
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;            

    // Events
    this.doMouseMove = this.doMouseMove.bind( this );
    this.doMouseUp = this.doMouseUp.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$bar = this.shadowRoot.querySelector( 'div[part=bar]' );
    this.$bar.addEventListener( this._touch ? 'touchstart' : 'mousedown', ( evt ) => {
      evt.preventDefault();

      this._bounds = this.$bar.getBoundingClientRect();
      this._position( evt );

      document.addEventListener( this._touch ? 'touchmove' : 'mousemove', this.doMouseMove );
      document.addEventListener( this._touch ? 'touchend' : 'mouseup', this.doMouseUp );
    } );
    this.$fill = this.shadowRoot.querySelector( 'div[part=fill]' );
    this.$handle = this.shadowRoot.querySelector( 'button' );    
    this.$handle.addEventListener( this._touch ? 'touchstart' : 'mousedown', ( evt ) => {
      evt.preventDefault();

      this._bounds = this.$bar.getBoundingClientRect();

      document.addEventListener( this._touch ? 'touchmove' : 'mousemove', this.doMouseMove );
      document.addEventListener( this._touch ? 'touchend' : 'mouseup', this.doMouseUp );
    } );
  }

  doMouseMove( evt ) {
    evt.preventDefault();
    this._position( evt );
  }

  doMouseUp() {
    document.removeEventListener( this._touch ? 'touchmove' : 'mousemove', this.doMouseMove );
    document.removeEventListener( this._touch ? 'touchend' : 'mouseup', this.doMouseUp );
    
    this._bounds = null;
  }

  map( value, in_min, in_max, out_min, out_max ) {
    return ( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  }

  _position( evt ) {
    const minimum = this._bounds.left;
    const maximum = this._bounds.left + this._bounds.width;
    const x = this._touch ? evt.touches[0].clientX : evt.clientX;

    if( x > minimum && x < maximum ) {
      this.value = Math.round( ( ( x - minimum ) / ( maximum - minimum ) ) * 100 );

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    }
  }

  // When attributes change
  _render() {
    const value = this.value === null ? 0 : this.value;
    this.$fill.style.width = value + '%';
    this.$handle.style.left = ( 21 + 16 + ( this.$bar.clientWidth * ( value / 100 ) ) - 11 ) + 'px';
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );
    this._upgrade( 'hidden' );
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }
  
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }  

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return parseInt( this.getAttribute( 'value' ) );
    }

    return null;
  }

  set value( date ) {
    if( date !== null ) {
      this.setAttribute( 'value', date );
    } else {
      this.removeAttribute( 'value' );
    }
  }          
}

window.customElements.define( 'aa-slider', AASlider );
