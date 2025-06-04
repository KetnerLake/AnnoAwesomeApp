import AALabel from "./label.js";
import AAMonth from "./month.js";

export default class AAYear extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #ffffff;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          overflow: scroll;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=header],
        div[part=year] {
          display: flex;
          flex-direction: row;
        }

        div[part=header] {
          position: sticky;
          top: 0;
          z-index: 100;
        }

        aa-label {
          background-color: #f7f7f7;
          border-bottom: solid 1px #c7c7c7;
          border-right: solid 1px #e5e5e5;
          min-width: 200px;
          padding: 0 16px 0 16px;          
        }

        aa-label::part( label ) {
          height: 36px;
          line-height: 36px;
          text-align: center;
        }

        div[part=year] div {
          bottom: 0;
          left: 0;
          position: absolute;
          top: 0;
          width: 200px;
        }
      </style>
      <div part="header"></div>
      <div part="year"></div>
    `;

    // Private
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
    this.$month = this.shadowRoot.querySelector( 'div[part=header]' );
    this.$year = this.shadowRoot.querySelector( 'div[part=year]' );
  }

  fit() {
    const bounds = this.$year.getBoundingClientRect();
    console.log( bounds );
    console.log( this.$year.scrollWidth );
    this.$month.style.transform = `scale( ${bounds.width / this.$year.scrollWidth} )`;    
    this.$year.style.transform = `scale( ${bounds.width / this.$year.scrollWidth} )`;
  }

  // When attributes change
  _render() {
    const now = new Date();
    const year = this.year === null ? now.getFullYear() : this.year;
    const value = new Date( year, 0, 1 );

    const formatter = new Intl.DateTimeFormat( navigator.language, {month: 'long'} );

    while( this.$year.children.length > 12 ) {
      this.$month.children[0].remove();
      this.$year.children[0].remove();
    }

    while( this.$year.children.length < 12 ) {
      const header = document.createElement( 'aa-label' );
      this.$month.appendChild( header );

      const month = document.createElement( 'aa-month' );
      this.$year.appendChild( month );
    }

    for( let m = 0; m < 12; m++ ) {
      this.$month.children[m].text = formatter.format( value );

      const events = this._data.length === 0 ? null : this._data.filter( ( x ) => {
        const parts = x.startAt.split( '-' );
        const start = new Date( parts[0], parts[1] - 1, parts[2] );
        return start.getMonth() === m;
      } );

      this.$year.children[m].data = events;
      this.$year.children[m].style.setProperty( '--active-background-color', this._colors[m].activeBackgroundColor );
      this.$year.children[m].style.setProperty( '--active-color', this._colors[m].activeColor );
      this.$year.children[m].style.setProperty( '--inactive-background-color', this._colors[m].activeBackgroundColor + '4d' );      
      this.$year.children[m].style.setProperty( '--inactive-color', this._colors[m].inactiveColor );      
      this.$year.children[m].month = value.getMonth();
      this.$year.children[m].year = year;
      
      value.setMonth( value.getMonth() + 1 );
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
    this._upgrade( 'year' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
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
    this._render();
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

window.customElements.define( 'aa-year', AAYear );
