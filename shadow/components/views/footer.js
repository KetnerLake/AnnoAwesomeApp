export default class AAFooter extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          border-top: solid 1px #c7c7c7;            
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr; 
          grid-template-rows: 1fr; 
          gap: 0px 0px;  
          height: 50px;
          padding: 0 16px 0 16px;        
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox {
          align-items: baseline;
        }

        aa-label {
          --label-text-align: center;          
        }

        aa-link {
          margin: 0 0 0 4px;          
        }

        input {
          justify-self: end;
        }
      </style>
      <aa-hbox>
        <aa-label text="Made with ❤️ in Colorado by"></aa-label>
        <aa-link href="https://ketnerlake.com" label="Kevin Hoyt" target="_blank"></aa-link>
        <aa-label text="."></aa-label>
      </aa-hbox>
      <aa-label part="count"></aa-label>
      <aa-rainbow hidden text="Tree wizard!"></aa-rainbow>
      <input max="100" min="1" type="range" value="50" />
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=count]' );
    this.$link = this.shadowRoot.querySelector( 'aa-link' );
    this.$scale = this.shadowRoot.querySelector( 'input' );
    this.$wizard = this.shadowRoot.querySelector( 'aa-rainbow' );
  }

  wizard() {
    this.$label.hidden = true;
    this.$wizard.hidden = false;

    setTimeout( () => {
      this.$label.hidden = false;
      this.$wizard.hidden = true;
    }, 5000 );
  }

  // When attributes change
  _render() {
    const plural = this.count !== 1 ? 's' : '';
    this.$label.text = `${this.count === null ? 0 : this.count} ${this.label === null ? 'event' : this.label}${plural}`;

    this.$link.disabled = this.disabled;
    this.$scale.disabled = this.disabled;
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
    this._upgrade( 'count' );      
    this._upgrade( 'data' );      
    this._upgrade( 'disabled' );          
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'count',
      'disabled',
      'hidden',
      'label'
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

  get count() {
    if( this.hasAttribute( 'count' ) ) {
      return parseInt( this.getAttribute( 'count' ) );
    }

    return null;
  }

  set count( value ) {
    if( value !== null ) {
      this.setAttribute( 'count', value );
    } else {
      this.removeAttribute( 'count' );
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

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }  
}

window.customElements.define( 'aa-footer', AAFooter );
