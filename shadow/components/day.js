export default class AADay extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: #ffffff;          
          border-bottom: solid 1px #e5e5e5;
          border-right: solid 1px #e5e5e5;                  
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          height: 36px;
          min-height: 36px;
          min-width: 36px;
          position: relative;
          width: 200px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        p {
          border-radius: 32px;
          box-sizing: border-box;
          color: #272727;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          height: 30px;
          line-height: 30px;
          margin: 0;
          min-height: 30px;
          min-width: 30px;
          margin: 0 0 0 2px;
          padding: 0;          
          text-align: center;          
          text-rendering: optimizeLegibility;
          width: 30px;       
        }

        :host( [month='11'] ) {
          border-right: none;
        }

        :host( [date='1'] ) {
          border-top: none;
        }

        :host( [date='31'] ) {
          border-bottom: none;
          height: 35px;
          min-height: 35px;
        }     

        :host( [weekend='0'] ),
        :host( [weekend='6'] ) {          
          background-color: #f5f5f5;
        }

        :host( [outside] ) {
          background: none;
          border-bottom: none;
          height: 35px;
          line-height: 35px;
          min-height: 35px;          
        }

        :host( [outside] ) p {
          display: none;
        }

        :host( [today] ) p {
          background-color: #0082ff;
          color: #ffffff;
          font-weight: 600;
        }
      </style>
      <p part="date"></p>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$date = this.shadowRoot.querySelector( 'p' );
  }

  // When attributes change
  _render() {
    this.$date.innerText = this.date === null ? 1 : this.date;
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
    this._upgrade( 'hidden' );
    this._upgrade( 'month' );    
    this._upgrade( 'outside' );        
    this._upgrade( 'today' );            
    this._upgrade( 'weekend' );    
    this._upgrade( 'year' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'date',
      'hidden',
      'month',
      'outside',
      'today',
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

  set date( date ) {
    if( date !== null ) {
      this.setAttribute( 'date', date );
    } else {
      this.removeAttribute( 'date' );
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

  set month( date ) {
    if( date !== null ) {
      this.setAttribute( 'month', date );
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

  get weekend() {
    if( this.hasAttribute( 'weekend' ) ) {
      return parseInt( this.getAttribute( 'weekend' ) );
    }

    return null;
  }

  set weekend( date ) {
    if( date !== null ) {
      this.setAttribute( 'weekend', date );
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

  set year( date ) {
    if( date !== null ) {
      this.setAttribute( 'value', date );
    } else {
      this.removeAttribute( 'value' );
    }
  }           
}

window.customElements.define( 'aa-day', AADay );
