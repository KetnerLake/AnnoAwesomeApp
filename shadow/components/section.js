import AAHBox from "./hbox.js";
import AALabel from "./label.js";
import AAVBox from "./vbox.js";

export default class AASection extends HTMLElement {
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
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox {
          justify-content: flex-end;
          margin: 0 16px 8px 16px;          
        }

        aa-label[part=label] {
          flex-basis: 0;
          flex-grow: 1;
          --label-color: #868686;
          --label-text-transform: uppercase;
        }

        aa-label[part=notes] {
          padding: 4px 16px 0 16px;
          --label-color: #868686;          
          --label-line-height: 21px;
          --label-font-size: 14px;
        }

        aa-vbox {
          background-color: #ffffff;
          border-radius: 4px;
        }

        ::slotted( aa-button:not( [slot] ) ) {
          --button-text-align: left;
        }

        ::slotted( aa-button[slot] ) {
          --button-font-size: 14px;
          --button-height: 14px;
          --button-line-height: 14px;
          --button-padding: 0;
          --button-text-transform: uppercase;
        }        

        :host( :not( [notes] ) ) aa-label[part=notes],
        :host( :not( [label] ) ) aa-label[part=label] {
          display: none;
        }
      </style>
      <aa-hbox>
        <aa-label part="label" size="s"></aa-label>
        <slot name="count"></slot>
      </aa-hbox>
      <aa-vbox>
        <slot></slot>      
      </aa-vbox>
      <aa-label part="notes"></aa-label>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$title = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$notes = this.shadowRoot.querySelector( 'aa-label[part=notes]' );
  }

   // When attributes change
  _render() {
    this.$title.text = this.label;
    this.$notes.text = this.notes;
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
    this._upgrade( 'hideNotes' );      
    this._upgrade( 'label' );           
    this._upgrade( 'notes' );  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'hide-notes',
      'label',      
      'notes'
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

  get hideNotes() {
    return this.hasAttribute( 'hide-notes' );
  }

  set hideNotes( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hide-notes' );
      } else {
        this.setAttribute( 'hide-notes', '' );
      }
    } else {
      this.removeAttribute( 'hide-notes' );
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

  get notes() {
    if( this.hasAttribute( 'notes' ) ) {
      return this.getAttribute( 'notes' );
    }

    return null;
  }

  set notes( value ) {
    if( value !== null ) {
      this.setAttribute( 'notes', value );
    } else {
      this.removeAttribute( 'notes' );
    }
  }        
}

window.customElements.define( 'aa-section', AASection );
