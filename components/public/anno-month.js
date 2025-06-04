import AADay from "./anno-day.js";
import AAEvent from "./anno-event.js";

export default class AAMonth extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          min-width: 240px;
        }

        #events {
          bottom: 0;
          left: 42px;
          position: absolute;
          right: 0;
          top: 0;
        }

        :host( [interactive] ) anno-event {
          --event-cursor: pointer;
        }
      </style>
      <div id="days">
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>
        <anno-day></anno-day>        
        <anno-day></anno-day>                                        
        <anno-day></anno-day>                                        
      </div>
      <div id="events"></div>
    `;

    // Events
    this.doDayClick = this.doDayClick.bind( this );

    // Private
    this._colors = [
      {name: 'Red', value: '#ff2968'},
      {name: 'Orange', value: '#ff9500'},
      {name: 'Yellow', value: '#ffcc02'},
      {name: 'Green', value: '#63da38'},
      {name: 'Blue', value: '#1badf8'},
      {name: 'Purple', value: '#cc73e1'}
    ];
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';        

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$days = this.shadowRoot.querySelector( '#days' );
    this.$events = this.shadowRoot.querySelector( '#events' );
  }

  doDayClick( evt ) {
    const id = evt.currentTarget.getAttribute( 'data-id' );
    const event = this._data.find( ( value ) => value.id === id ? true : false );
    this.dispatchEvent( new CustomEvent( 'aa-event', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: event
    } ) );
  }

  collides( a, b ) {
    return a.bottom > b.top && a.top < b.bottom;
  }

  pack( columns, width ) {
    let n = columns.length;

    for( let i = 0; i < n; i++ ) {
      let column = columns[i];
      for( let j = 0; j < column.length; j++ ) {
        const button = column[j];
        button.element.style.left = `${( i / n ) * 100}%`;
        button.element.style.width = `${( width / n - 1 )}px`;
      }
    }
  }  

  week( date ) {
    date = new Date( Date.UTC( date.getFullYear(), date.getMonth(), date.getDate() ) );
    date.setUTCDate( date.getUTCDate() + 4 - ( date.getUTCDay() || 7 ) );
    const yearStart = new Date( Date.UTC( date.getUTCFullYear(), 0, 1 ) );
    return Math.ceil( ( ( ( date - yearStart ) / 86400000 ) + 1 ) / 7 );
  }

   // When attributes change
  _render() {
    const today = new Date();
    const year = this.year === null ? new Date().getFullYear() : this.year;
    const month = this.month === null ? new Date().getMonth() : this.month;

    let index = 0;

    for( let d = 0; d < 31; d++ ) {
      const cell = new Date( year, month, d + 1 );

      this.$days.children[d].weekend = cell.getDay() === 0 || cell.getDay() === 6 ? true : false;
      this.$days.children[d].date = d + 1;
      this.$days.children[d].month = month;      
      this.$days.children[d].year = year;      

      const days = new Date( year, month + 1, 0 );          
      this.$days.children[d].outside = ( d + 1 ) > days.getDate() ? true : false;

      const week = this.week( cell );
      if( week !== index || d === 0 ) {
        index = week;
        this.$days.children[d].week = index;
      } else {
        this.$days.children[d].week = null;
      }      

      this.$days.children[d].today = 
        today.getFullYear() === cell.getFullYear() &&
        today.getMonth() === cell.getMonth() &&
        today.getDate() === cell.getDate() ? true : false;
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
    this._upgrade( 'color' );    
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'hidden' );
    this._upgrade( 'interactive' );
    this._upgrade( 'month' );        
    this._upgrade( 'useCalendarColors' );            
    this._upgrade( 'year' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'color',
      'concealed',
      'hidden',
      'interactive',
      'month',
      'use-calendar-colors',
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
    return this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    // Width to use for stacking
    const width = this.$events.clientWidth;      

    // Remove excess
    while( this.$events.children.length > this._data.length ) {
      this.$events.children[0].removeEventListener( this._touch, this.doDayClick );
      this.$events.children[0].remove();
    }

    // Add needed
    while( this.$events.children.length < this._data.length ) {
      const element = document.createElement( 'anno-event' );
      element.addEventListener( this._touch, this.doDayClick );      
      this.$events.appendChild( element );
    }

    let color = this._colors[this.month % this._colors.length].value;              

    // Populate and decorate
    for( let c = 0; c < this.$events.children.length; c++ ) {
      const top = ( ( this._data[c].startsAt.getDate() - 1 ) * 40 );
      const height = ( ( this._data[c].endsAt.getDate() - this._data[c].startsAt.getDate() ) * 40 ) + 39;

      if( this.useCalendarColors ) {
        color = this.color;
      }

      this.$events.children[c].setAttribute( 'data-id', this._data[c].id );
      this.$events.children[c].setAttribute( 'data-calendar-color', this.color );          
      this.$events.children[c].setAttribute( 'data-month-color', this._colors[this.month % this._colors.length].value );

      this.$events.children[c].style.setProperty( '--event-active-color', '#ffffff' );
      this.$events.children[c].style.setProperty( '--event-active-background-color', color );        
      this.$events.children[c].style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );                
      this.$events.children[c].style.setProperty( '--event-inactive-background-color', color + '4d' );                

      this.$events.children[c].style.top = `${top}px`;
      this.$events.children[c].style.height = `${height}px`;        

      this.$events.children[c].summary = this._data[c].summary;
      this.$events.children[c].location = this._data[c].location;      
    }    

    let columns = [];
    let last = null;

    // Map button positions
    let buttons = Array.from( this.$events.children );
    buttons = buttons.map( ( value ) => {
      return {
        element: value,
        top: parseInt( value.style.top ),
        bottom: parseInt( value.style.top ) + parseInt( value.style.height )
      };
    } );      

    // Sort buttons based on fit
    buttons.sort( function( a, b ) {
      if( a.top < b.top ) return -1;
      if( a.top > b.top ) return 1;
      if( a.bottom < b.bottom ) return -1;
      if( a.bottom > b.bottom ) return 1;
      return 0;
    } );

    // Pack buttons to columns
    buttons.forEach( ( value ) => {
      if( last !== null && value.top >= last ) {
        this.pack( columns, width );
        columns = [];
        last = null;
      }

      let placed = false;

      for( let c = 0; c < columns.length; c++ ) {
        let column = columns[c];
        if( !this.collides( column[column.length - 1], value ) ) {
          column.push( value );
          placed = true;
          break;
        }
      }

      if( !placed ) {
        columns.push( [value] );
      }

      if( last === null || value.bottom > last ) {
        last = value.bottom;
      }
    } );      

    // Place buttons in columns
    if( columns.length > 0 ) {
      this.pack( columns, width );
    }
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get color() {
    if( this.hasAttribute( 'color' ) ) {
      return this.getAttribute( 'color' );
    }

    return null;
  }

  set color( value ) {
    if( value !== null ) {
      this.setAttribute( 'color', value );
    } else {
      this.removeAttribute( 'color' );
    }
  }

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

  get interactive() {
    return this.hasAttribute( 'interactive' );
  }

  set interactive( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'interactive' );
      } else {
        this.setAttribute( 'interactive', '' );
      }
    } else {
      this.removeAttribute( 'interactive' );
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

  get useCalendarColors() {
    return this.hasAttribute( 'use-calendar-colors' );
  }

  set useCalendarColors( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'use-calendar-colors' );
      } else {
        this.setAttribute( 'use-calendar-colors', '' );
      }
    } else {
      this.removeAttribute( 'use-calendar-colors' );
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

window.customElements.define( 'anno-month', AAMonth );
