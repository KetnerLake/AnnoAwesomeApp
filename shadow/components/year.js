import AADay from "./day.js";
import AAEvent from "./event.js";

export default class AAYear extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;          
          box-sizing: border-box;
          display: block;
          overflow: auto;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=events] {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 36px;
        }

        div[part=header] {
          display: flex;
          flex-direction: row;
          position: sticky;
          top: 0;
          z-index: 100;          
        }

        div[part=header] p {
          background-color: #f4f4f3;          
          border-bottom: solid 1px #c7c7c7;
          border-right: solid 1px #e5e5e5;          
          box-sizing: border-box;
          color: #272727;
          cursor: default;
          display: inline-block;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 36px;
          line-height: 36px;
          margin: 0;
          min-height: 36px;
          min-width: 200px;
          padding: 0 0 0 9px;          
          text-align: center;          
          text-rendering: optimizeLegibility;
          width: 200px;          
        }

        div[part=header] p:last-of-type {        
          border-right: none;
        }

        div[part=year] {
          display: grid;
          grid-template-columns: repeat( 12, 1fr );
          grid-template-rows: repeat( 31, 1fr );  
        }
      </style>
      <div part="header"></div>
      <div part="year"></div>
      <div part="events"></div>
    `;

    // Private
    this._colors = ['#ff2968', '#ff9500', '#ffcc02', '#63da38', '#1badf8', '#cc73e1'];
    /*
    this._colors = [
      {activeBackgroundColor: '#F44336', activeColor: '#ffffff', inactiveColor: '#B71C1C'},
      {activeBackgroundColor: '#E91E63', activeColor: '#ffffff', inactiveColor: '#880E4F'},      
      {activeBackgroundColor: '#9C27B0', activeColor: '#ffffff', inactiveColor: '#4A148C'},            
      {activeBackgroundColor: '#3F51B5', activeColor: '#ffffff', inactiveColor: '#1A237E'},                  
      {activeBackgroundColor: '#2196F3', activeColor: '#ffffff', inactiveColor: '#0D47A1'},                        
      {activeBackgroundColor: '#00BCD4', activeColor: '#ffffff', inactiveColor: '#006064'},                              
      {activeBackgroundColor: '#009688', activeColor: '#ffffff', inactiveColor: '#004D40'},                                    
      {activeBackgroundColor: '#4CAF50', activeColor: '#ffffff', inactiveColor: '#1B5E20'},                                          
      {activeBackgroundColor: '#8BC34A', activeColor: '#ffffff', inactiveColor: '#33691E'},                                                
      {activeBackgroundColor: '#CDDC39', activeColor: '#ffffff', inactiveColor: '#827717'},  
      {activeBackgroundColor: '#FF5722', activeColor: '#ffffff', inactiveColor: '#BF360C'},                                                                  
      {activeBackgroundColor: '#795548', activeColor: '#ffffff', inactiveColor: '#3E2723'}                                                                             
    ];
    */
    this._data = [];

    // 500 and 900 from:
    // https://m1.material.io/style/color.html#color-color-palette    
    // Excluded for contrast:
    // {activeBackgroundColor: '#FFEB3B', activeColor: '#ffffff', inactiveColor: '#F57F17'},    
    // {activeBackgroundColor: '#673AB7', activeColor: '#ffffff', inactiveColor: '#311B92'},                                                                 
    // {activeBackgroundColor: '#FF9800', activeColor: '#ffffff', inactiveColor: '#E65100'},                                                                           

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$grid = this.shadowRoot.querySelector( 'div[part=year]' );
    this.$header = this.shadowRoot.querySelector( 'div[part=header]' );
    this.$events = this.shadowRoot.querySelector( 'div[part=events]' );
  }

  fit() {
    const bounds = this.parentElement.getBoundingClientRect();
    console.log( bounds );
    console.log( this.$grid.scrollWidth );
    this.style.transform = `scale( ${bounds.width / this.$grid.scrollWidth} )`;
    // this.style.width = '100%;'
  }  

  // When attributes change
  _render() {
    // Header
    while( this.$header.children.length > 12 ) {
      this.$header.children[0].remove();
    }

    while( this.$header.children.length < 12 ) {
      const month = document.createElement( 'p' );
      this.$header.appendChild( month );
    }    

    const formatter = new Intl.DateTimeFormat( navigator.language, {month: 'long'} );
    const today = new Date();          

    for( let m = 0; m < 12; m++ ) {
      const calendar = new Date( this.value === null ? today.getFullYear() : this.value, m, 1 );
      this.$header.children[m].innerText = formatter.format( calendar );
    }

    // Year
    while( this.$grid.children.length > ( 12 * 31 ) ) {
      this.$grid.children[0].remove();
    }

    while( this.$grid.children.length < ( 12 * 31 ) ) {
      const day = document.createElement( 'aa-day' );
      this.$grid.appendChild( day );
    }

    for( let d = 0; d < 31; d++ ) {
      for( let m = 0; m < 12; m++ ) {  
        const index = ( d * 12 ) + m;

        const cell = new Date( this.value === null ? today.getFullYear() : this.value, m, d + 1 );
        this.$grid.children[index].weekend = cell.getDay();                
        this.$grid.children[index].date = d + 1;
        this.$grid.children[index].month = m;
        this.$grid.children[index].year = this.value === null ? today.getFullYear() : this.value;

        const days = new Date( this.value === null ? today.getFullYear() : this.value, m + 1, 0 );
        this.$grid.children[index].outside = ( d + 1 ) > days.getDate() ? true : false;

        if( today.getFullYear() === cell.getFullYear() &&
            today.getMonth() === cell.getMonth() &&
            today.getDate() === cell.getDate() ) {
            this.$grid.children[index].today = true;            
        } else {
          this.$grid.children[index].today = false;            
        }
      }
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
    this._upgrade( 'selectedItem' );        
    this._upgrade( 'value' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
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
      /*
      let parts = this._data[c].startsAt.split( '-' );
      const starts = new Date( parseInt( parts[0] ), parseInt( parts[1] ) - 1, parseInt( parts[2] ) );
      
      parts = this._data[c].endsAt.split( '-' );
      const ends = new Date( parseInt( parts[0] ), parseInt( parts[1] ) - 1, parseInt( parts[2] ) );
      */
      const diff = ( this._data[c].endsAt.getDate() - this._data[c].startsAt.getDate() ) + 1;

      this.$events.children[c].summary = this._data[c].summary;
      this.$events.children[c].location = this._data[c].location;      
      this.$events.children[c].data = this._data[c];
      
      this.$events.children[c].style.left = `${( this._data[c].startsAt.getMonth() * 200 ) + 35}px`;
      this.$events.children[c].style.top = `${( this._data[c].startsAt.getDate() - 1 ) * 36}px`;
      this.$events.children[c].style.height = `${( diff * 36 ) - 1}px`;      

      const month = this._data[c].startsAt.getMonth();
      const color = this._data[c].hasOwnProperty( 'color' ) ? this._data[c].color : this._colors[month % this._colors.length];

      this.$events.children[c].style.setProperty( '--event-active-background-color', color );
      this.$events.children[c].style.setProperty( '--event-active-color', '#ffffff' );
      this.$events.children[c].style.setProperty( '--event-inactive-background-color', color + '4d' );      
      this.$events.children[c].style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );      
    }
  }

  set selectedItem( id ) {
    for( let c = 0; c < this.$events.children.length; c++ ) {
      if( id === null ) {
        this.$events.children[c].selected = false;
      } else {
        if( this.$events.children[c].data.id === id ) {
          this.$events.children[c].selected = true;
          this.$events.children[c].scrollIntoView( {behavior: 'smooth', block: 'end', inline: 'start'} );
        } else {
          this.$events.children[c].selected = false;          
        }
      }
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

window.customElements.define( 'aa-year', AAYear );
