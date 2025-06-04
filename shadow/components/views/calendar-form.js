import {store} from "../../store.js";

export default class AACalendarForm extends HTMLElement {
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

        aa-button[part=cancel] {
          justify-self: start; 
          --button-padding: 0;
        }

        aa-button[part=delete] {
          --button-background: #ffffff; 
          --button-color: red;          
        }

        aa-button[part=done] {
          justify-self: end; 
          --button-padding: 0;          
        }

        aa-hbox {
          height: 36px; 
          padding: 0 16px 0 16px;          
        }

        aa-label[part=label] {
          justify-self: center; 
          --label-line-height: 36px;
        }

        div {
          display: grid; 
          grid-template-columns: 1fr 1fr 1fr; 
          grid-template-rows: 1fr; 
          gap: 0px 0px;            
          padding-bottom: 16px;
        }
      </style>
      <div>
        <aa-button label="Cancel" part="cancel"></aa-button>
        <aa-label part="label" weight="bold"></aa-label>
        <aa-button disabled label="Done" part="done"></aa-button>
      </div>     
      <aa-vbox gap="l">
        <aa-section>
          <aa-input part="name" placeholder="Calendar name"></aa-input>
        </aa-section>                   
        <aa-section label="Color">
          <aa-color-picker part="color"></aa-color-picker>
        </aa-section>                                 
        <aa-section label="Shared with">
          <aa-button label="Add person" part="share"></aa-button>
        </aa-section>                                         
        <aa-section notes="Allow anyone access to a read-only version of this calendar.">
          <aa-hbox centered>
            <aa-label text="Public calendar" style="flex-basis: 0; flex-grow: 1;"></aa-label>
            <aa-toggle part="public"></aa-toggle>
          </aa-hbox>
        </aa-section>                                                         
        <aa-button hidden label="Delete calendar" part="delete"></aa-button>
      </aa-vbox>
    `;

    // Private
    this._changed = false;
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$cancel = this.shadowRoot.querySelector( 'aa-button[part=cancel]' );
    this.$cancel.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );
    } );
    this.$color = this.shadowRoot.querySelector( 'aa-color-picker[part=color]' );
    this.$color.data = store.colors.get();
    this.$delete = this.shadowRoot.querySelector( 'aa-button[part=delete]' );
    this.$delete.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      const response = confirm( 'Are you sure you want to delete this calendar?' );
      if( !response ) return;
      this.dispatchEvent( new CustomEvent( 'aa-delete' ) );
    } );
    this.$done = this.shadowRoot.querySelector( 'aa-button[part=done]' );    
    this.$done.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-done' ) );
    } );    
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$name = this.shadowRoot.querySelector( 'aa-input[part=name]' );
    this.$name.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.validate();
    } );
    this.$public = this.shadowRoot.querySelector( 'aa-toggle' );
    this.$public.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.validate();
    } );
  }

  focus() {
    this.$name.focus();
  }

  validate() {
    let valid = true;

    if( this.$name.value === null ) valid = false;

    this.$done.disabled = !valid;

    return valid;
  }

   // When attributes change
  _render() {
    this.$label.text = `${this._data === null ? 'Add' : 'Edit'} Calendar`;
    this.$delete.hidden = !this.canDelete;
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
    // this._upgrade( 'canDelete' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    // 'can-delete',    
    return [
      'concealed',
      'hidden'
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
    if( this._data === null ) return nulll;

    const now = new Date();
    return {
      id: this._data === null ? self.crypto.randomUUID() : this._data.id,
      createdAt: this._data === null ? now : this._data.createdAt,
      updatedAt: now,
      name: this.$name.value,
      color: this.$color.value,
      isShared: false,
      isActive: this._data === null ? true : this._data.isActive,
      isPublic: this.$public.checked
    };
  }

  set data( value ) {
    this._changed = false;
    this._data = value === null ? null : structuredClone( value );

    this.$label.text = `${this._data === null ? 'Add' : 'Edit'} Calendar`;
    this.$done.disabled = true;        
    this.$name.value = this._data === null ? null : this._data.name;
    this.$color.selectedItem = this._data === null ? null : this._data.color;
    // this.$color.open = false;
    this.$public.value = this._data === null ? false : this._data.isPublic;    
    this.$delete.hidden = this._data === null ? true : false;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  /*
  get canDelete() {
    return this.hasAttribute( 'can-delete' );
  }

  set canDelete( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'can-delete' );
      } else {
        this.setAttribute( 'can-delete', '' );
      }
    } else {
      this.removeAttribute( 'can-delete' );
    }
  }
  */

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
}

window.customElements.define( 'aa-calendar-form', AACalendarForm );
