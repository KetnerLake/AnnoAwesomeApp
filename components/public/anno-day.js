export default class AADay extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          border-bottom: solid 1px #e5e5e5;
          border-right: solid 1px #e5e5e5;          
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 40px;
          padding: 0 0 0 3px;
          position: relative;
          min-width: 240px;
        }

        p {
          border-radius: 18px;
          color: #272727;
          cursor: default;
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 400;
          font-size: 16px;
          height: 36px;
          line-height: 16px;
          margin: 0;
          padding: 0;
          text-align: center;
          text-rendering: optimizeLegibility;
          width: 36px;
        }

        p span {
          display: block;
        }

        p span:first-of-type {
          margin-top: 4px;
        }

        p span:last-of-type {
          color: #868686;
          font-size: 12px;
          line-height: 12px;
        }

        :host( :not( [week] ) ) p span:first-of-type {
          line-height: 36px;
          margin: 0;
        }

        :host( :not( [week] ) ) p span:last-of-type {
          display: none;
        }

        :host( [date='31'] ) {
          border-bottom: none;
        }

        :host( [weekend] ) {
          background-color: #f5f5f5;            
        }

        :host( [month='11'] ) {
          border-right: none;
        }

        :host( [outside] ) {
          background: none;
          border-bottom: none;          
        }

        :host( [outside] ) p {
          display: none;
        }                

        :host( [today] ) p {
          background-color: #0082ff;
          color: #ffffff;
        }

        :host( [today] ) p span:first-of-type {
          font-weight: 600;
        }
      </style>
      <p>
        <span></span>
        <span></span>
      </p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$date = this.shadowRoot.querySelector( 'p span:first-of-type' );
    this.$week = this.shadowRoot.querySelector( 'p span:last-of-type' );    
  }

   // When attributes change
  _render() {
    this.$date.textContent = this.date === null ? '' : this.date;
    this.$week.textContent = this.week === null ? '' : this.week;
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
    this._upgrade( 'date' );
    this._upgrade( 'month' );            
    this._upgrade( 'outside' );        
    this._upgrade( 'today' );        
    this._upgrade( 'week' );    
    this._upgrade( 'weekend' );        
    this._upgrade( 'year' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'date',
      'month',
      'outside',
      'today',
      'week',
      'weekend',
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

  get date() {
    if( this.hasAttribute( 'date' ) ) {
      return parseInt( this.getAttribute( 'date' ) );
    }

    return null;
  }

  set date( value ) {
    if( value !== null ) {
      this.setAttribute( 'date', value );
    } else {
      this.removeAttribute( 'date' );
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

  get outside() {
    return this.hasAttribute( 'outside' );
  }

  set outside( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'outside' );
      } else {
        this.setAttribute( 'outside', '' );
      }
    } else {
      this.removeAttribute( 'outside' );
    }
  }
  
  get today() {
    return this.hasAttribute( 'today' );
  }

  set today( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'today' );
      } else {
        this.setAttribute( 'today', '' );
      }
    } else {
      this.removeAttribute( 'today' );
    }
  }  
  
  get week() {
    if( this.hasAttribute( 'week' ) ) {
      return parseInt( this.getAttribute( 'week' ) );
    }

    return null;
  }

  set week( value ) {
    if( value !== null ) {
      this.setAttribute( 'week', value );
    } else {
      this.removeAttribute( 'week' );
    }
  }              

  get weekend() {
    return this.hasAttribute( 'weekend' );
  }

  set weekend( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'weekend' );
      } else {
        this.setAttribute( 'weekend', '' );
      }
    } else {
      this.removeAttribute( 'weekend' );
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

window.customElements.define( 'anno-day', AADay );
