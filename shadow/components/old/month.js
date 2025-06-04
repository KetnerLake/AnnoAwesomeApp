import AADay from "./day.js";
import AAEvent from "./event.js";

export default class AAMonth extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: column;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=days] {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 200px;
          position: relative;
        }

        div[part=events] {
          bottom: 0;
          left: 35px;
          position: absolute;
          top: 0;
          right: 0;
        }

        aa-day {
          border-bottom: solid 1px #e5e5e5;
          border-right: solid 1px #e5e5e5;
        }

        .weekend {
          background-color: #f5f5f5;
        }
      </style>
      <div part="days"></div>
      <div part="events"></div>            
    `;

    // Private
    this._data = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$days = this.shadowRoot.querySelector( 'div[part=days]' );
    this.$events = this.shadowRoot.querySelector( 'div[part=events]' );    
  }

  // When attributes change
  _render() {
    const now = new Date();
    const month = this.month === null ? now.getMonth() : this.month;
    const year = this.year === null ? now.getFullYear() : this.year;

    let value = new Date( year, month + 1, 0 );
    const days = value.getDate();
    value = new Date( year, month, 1 );

    while( this.$days.children.length > days ) {
      this.$days.children[0].remove();
    }

    while( this.$days.children.length < days ) {
      const day = document.createElement( 'aa-day' );
      this.$days.appendChild( day );
    }

    for( let d = 0; d < days; d++ ) {
      if( value.getDay() === 0 || value.getDay() === 6 ) {
        this.$days.children[d].classList.add( 'weekend' );
      } else {
        this.$days.children[d].classList.remove( 'weekend' );
      }

      this.$days.children[d].value = d + 1;
      value.setDate( value.getDate() + 1 );
    }
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
    this._upgrade( 'hidden' );
    this._upgrade( 'month' ); 
    this._upgrade( 'year' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'month',
      'year'
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
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    while( this.$events.children.length > this._data.length ) {
      this.$events.children[0].remove();
    }

    while( this.$events.children.length < this._data.length ) {
      const event = document.createElement( 'aa-event' );
      this.$events.appendChild( event );
    }

    for( let c = 0; c < this.$events.children.length; c++ ) {
      let parts = this._data[c].startAt.split( '-' );
      const start = new Date( parts[0], parts[1] - 1, parts[2] );

      parts = this._data[c].endAt.split( '-' );
      const end = new Date( parts[0], parts[1] - 1, parts[2] );

      const diff = ( end.getDate() - start.getDate() ) + 1;
      this.$events.children[c].label = this._data[c].label;
      this.$events.children[c].location = this._data[c].location;      
      this.$events.children[c].style.top = `${( ( start.getDate() - 1 ) * 36 )}px`;
      this.$events.children[c].style.setProperty( '--event-duration', `${( diff * 36 ) - 1}px` );      
    }
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

  get month() {
    if( this.hasAttribute( 'month' ) ) {
      return parseInt( this.getAttribute( 'month' ) );
    }

    return null;
  }

  set month( value ) {
    if( value !== null ) {
      this.setAttribute( 'month', value );
    } else {
      this.removeAttribute( 'month' );
    }
  }           
  
  get year() {
    if( this.hasAttribute( 'year' ) ) {
      return parseInt( this.getAttribute( 'year' ) );
    }

    return null;
  }

  set year( value ) {
    if( value !== null ) {
      this.setAttribute( 'year', value );
    } else {
      this.removeAttribute( 'year' );
    }
  }             
}

window.customElements.define( 'aa-month', AAMonth );
