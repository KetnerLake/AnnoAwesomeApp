import AADetails from "./anno-details.js";
import AAMonth from "./anno-month.js";

export default class AAEmbed extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        article {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }

        button {
          align-items: center;
          appearance: none;
          background: none;
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          color: #0082ff;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          font-size: 16px;
          justify-content: center;
          gap: 8px;
          height: 36px;
          line-height: 36px;
          margin: 0;
          outline: transparent;
          padding: 0 16px 0 16px;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;            
        }

        button:has( img ) {
          padding: 0;
          width: 36px;
        }

        button img {
          box-sizing: border-box;
          display: inline-block;
          filter: 
            invert( 33% ) 
            sepia( 22% ) 
            saturate( 7473% ) 
            hue-rotate( 197deg ) 
            brightness( 104% ) 
            contrast( 103% );            
          height: 16px;
          width: 16px;
        }        

        header {
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        header h5 {
          background-color: #f4f4f4;          
          border-bottom: solid 1px #c7c7c7;          
          box-sizing: border-box;
          border-right: solid 1px #e5e5e5;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 34px;
          margin: 0;
          min-width: 240px;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          transition: color 0.25s linear;
        }

        header h5:hover {
          color: #0082ff;
        }

        header h5:last-of-type {        
          border-right: none;
        }

        nav {
          align-items: center;
          background-color: #f4f4f4;
          display: flex;
          flex-direction: row;
          padding: 8px 16px 8px 16px;
        }

        nav button:first-of-type {
          margin-left: auto;
        }

        nav h3 {
          color: #272727;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 32px;
          font-weight: 600;
          line-height: 36px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
          transition: color 0.25s linear;          
        }

        nav h3:hover {
          color: #0082ff;
        }        

        section {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          height: 100%;
          overflow: auto;
        }

        :host( [hide-headers] ) header {
          display: none;
        }

        :host( [hide-headers] ) nav {
          border-bottom: solid 1px #c7c7c7;          
        }

        :host( [hide-navigation] ) nav {
          display: none;
        }
      </style>
      <nav>
        <h3>2024</h3>
        <button id="previous" type="button">
          <img src="/app/img/chevron-left.svg" />
        </button>
        <button id="today" type="button">Today</button>
        <button id="next" type="button">
          <img src="/app/img/chevron-right.svg" />        
        </button>        
      </nav>
      <section>
        <header>
          <h5></h5>
          <h5></h5>
          <h5></h5>
          <h5></h5>                              
          <h5></h5>
          <h5></h5>
          <h5></h5>
          <h5></h5>                              
          <h5></h5>
          <h5></h5>
          <h5></h5>
          <h5></h5>                                                  
        </header>
        <article>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>
          <anno-month></anno-month>                    
        </article>
      </section>
      <anno-details></anno-details>
    `;

    // Private
    this._data = null;
    this._loaded = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$article = this.shadowRoot.querySelector( 'article' );    
    this.$details = this.shadowRoot.querySelector( 'anno-details' );
    this.$details.addEventListener( 'aa-done', () => this.$details.open = false );
    this.$header = this.shadowRoot.querySelector( 'header' );
    this.$header.addEventListener( this._touch, () => {
      this.$section.scrollTo( {
        top: 0, 
        behavior: 'smooth'
      } );
    } );
    this.$next = this.shadowRoot.querySelector( '#next' );    
    this.$previous = this.shadowRoot.querySelector( '#previous' );
    this.$section = this.shadowRoot.querySelector( 'section' );
    this.$section.addEventListener( 'aa-event', ( evt ) => {
      if( this.interactive ) {
        this.$details.open = true;
      }
    } );
    this.$today = this.shadowRoot.querySelector( '#today' );   
    this.$today.addEventListener( this._touch, () => {
      const today = new Date();
      this.$section.scrollTo( {
        left: ( today.getMonth() * 240 ) - ( this.$section.clientWidth / 2 ),
        top: ( today.getDate() * 40 ) - ( this.$section.clientHeight / 2 ),
        behavior: 'smooth'
      } );
      this.year = today.getFullYear();
      // headerChange( evt );
    } );
    this.$year = this.shadowRoot.querySelector( 'h3' );
    this.$year.addEventListener( this._touch, () => {
      this.$section.scrollTo( {
        left: 0, 
        top: 0, 
        behavior: 'smooth'
      } );
    } );     
  }

  navigate( evt ) {
    /*
    year_store = evt.detail.starts.getFullYear();
    starts = new Date( evt.detail.starts.getFullYear(), 0, 1 );
    ends = new Date( evt.detail.ends.getFullYear(), 0, 1 );
  
    year_view.setAttribute( 'value', year_store );
  
    db.event.where( 'startsAt' ).between( starts, ends ).toArray()
    .then( ( data ) => {
      data = data.map( ( value ) => {
        value.color = colors[value.calendarId];
        return value;
      } );
      data.sort( ( a, b ) => {
        const first = a.startsAt.getFullYear() + '-' + ( a.startsAt.getMonth() + 1 ) + '-' + a.startsAt.getDate();
        const second = b.startsAt.getFullYear() + '-' + ( b.startsAt.getMonth() + 1 ) + '-' + b.startsAt.getDate();    
    
        if( sort_store === 'desc' ) {
          if( first < second ) return 1;
          if( first > second ) return -1;        
        } else {
          if( first < second ) return -1;
          if( first > second ) return 1;        
        }
    
        // Pin like colors to the left side
        // Inverse sort pins colors to the right side
        if( a.color < b.color ) return 1;
        if( a.color > b.color ) return -1;
    
        if( a.summary < b.summary ) return -1;
        if( a.summary > b.summary ) return 1;    
    
        return 0;
      } );
    
      const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
      events = data.filter( ( value ) => active.includes( value.calendarId ) );
  
      year_view.data = events;
      event_list.data = events;
      footer.setAttribute( 'count', events.length );
    } );    
    */
  }  

  // When attributes change
  _render() {
    if( this._loaded === null ) {
      if( this._loaded !== this.calendar ) {
        const storage = this.storage === null ? 'https://annoawesome-public.s3.us-west-2.amazonaws.com' : this.storage;
        fetch( `${storage}/${this.calendar}.json`, {cache: 'no-store'} )
        .then( ( response ) => response.json() )
        .then( ( data ) => {
          console.log( data );
          this._data = structuredClone( data );

          for( let e = 0; e < this._data.events.length; e++ ) {
            this._data.events[e].createdAt = new Date( this._data.events[e].createdAt );
            this._data.events[e].updatedAt = new Date( this._data.events[e].updatedAt );            
            this._data.events[e].startsAt = new Date( this._data.events[e].startsAt );
            this._data.events[e].endsAt = new Date( this._data.events[e].endsAt );
          }

          const year = this.year === null ? new Date().getFullYear() : this.year;
          for( let c = 0; c < this.$article.children.length; c++ ) {
            this.$article.children[c].color = data.color;            
            this.$article.children[c].useCalendarColor = this.useCalendarColor;            
            this.$article.children[c].data = this._data.events.filter( ( value ) => value.startsAt.getFullYear() === year && value.startsAt.getMonth() === c ? true : false );
          }
        } );
        this._loaded = this.calendar;
      }
    }

    const year = this.year === null ? new Date().getFullYear() : this.year;
    this.$year.textContent = year;
    
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } );
    
    for( let m = 0; m < 12; m++ ) {
      this.$header.children[m].textContent = formatter.format( new Date( year, m, 1 ) );
      this.$article.children[m].month = m;
      this.$article.children[m].year = year;
      this.$article.children[m].interactive = this.interactive;
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
    this._upgrade( 'calendar' );    
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'hidden' );
    this._upgrade( 'hideHeaders' );
    this._upgrade( 'hideNavigation' );    
    this._upgrade( 'interactive' );    
    this._upgrade( 'storage' );    
    this._upgrade( 'useCalendarColor' );    
    this._upgrade( 'year' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'calendar',      
      'concealed',
      'hidden',
      'hide-headers',
      'hide-navigation',
      'interactive',
      'storage',
      'use-calendar-color',
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
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get calendar() {
    if( this.hasAttribute( 'calendar' ) ) {
      return this.getAttribute( 'calendar' );
    }

    return null;
  }

  set calendar( value ) {
    if( value !== null ) {
      this.setAttribute( 'calendar', value );
    } else {
      this.removeAttribute( 'calendar' );
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

  get hideHeaders() {
    return this.hasAttribute( 'hide-headers' );
  }

  set hideHeaders( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-headers' );
      } else {
        this.setAttribute( 'hide-headers', '' );
      }
    } else {
      this.removeAttribute( 'hide-headers' );
    }
  }
  
  get hideNavigation() {
    return this.hasAttribute( 'hide-navigation' );
  }

  set hideNavigation( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-navigation' );
      } else {
        this.setAttribute( 'hide-navigation', '' );
      }
    } else {
      this.removeAttribute( 'hide-navigation' );
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

  get storage() {
    if( this.hasAttribute( 'storage' ) ) {
      return this.getAttribute( 'storage' );
    }

    return null;
  }

  set storage( value ) {
    if( value !== null ) {
      this.setAttribute( 'storage', value );
    } else {
      this.removeAttribute( 'storage' );
    }
  }  

  get useCalendarColor() {
    return this.hasAttribute( 'use-calendar-color' );
  }

  set useCalendarColor( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'use-calendar-color' );
      } else {
        this.setAttribute( 'use-calendar-color', '' );
      }
    } else {
      this.removeAttribute( 'use-calendar-color' );
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

window.customElements.define( 'anno-awesome', AAEmbed );
