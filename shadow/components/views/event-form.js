export default class AAEventForm extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-button[part=add] {
          justify-self: end; 
          --button-padding: 0;          
        }        

        aa-button[part=cancel] {
          justify-self: start; 
          --button-padding: 0;
        }        

        aa-button[part=delete] {
          --button-background: #ffffff; 
          --button-color: red;          
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
        } 
      </style>
      <div>
        <aa-button label="Cancel" part="cancel"></aa-button>
        <aa-label part="label" weight="bold"></aa-label>
        <aa-button disabled label="Add" part="add"></aa-button>
      </div>                  
      <aa-section>
        <aa-input part="title" placeholder="Title"></aa-input>
        <aa-divider></aa-divider>
        <aa-input part="location" placeholder="Location"></aa-input>        
      </aa-section>
      <aa-section>
        <aa-date-picker label="Starts" part="starts"></aa-date-picker>
        <aa-divider></aa-divider>
        <aa-date-picker label="Ends" part="ends"></aa-date-picker>
      </aa-section>
      <aa-section>
        <aa-select label="Calendar" label-field="name" part="calendars" value-field="id"></aa-select>
      </aa-section>
      <aa-section>
        <aa-attachment></aa-attachment>
      </aa-section>
      <aa-section>
        <aa-input part="url" placeholder="URL"></aa-input>
        <aa-divider></aa-divider>
        <aa-textarea part="notes" placeholder="Notes"></aa-textarea>
      </aa-section>
      <aa-button label="Delete event" part="delete"></aa-button> 
    `;

    // Private
    this._calendars = [];
    this._changed = false;
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$add = this.shadowRoot.querySelector( 'aa-button[part=add]' );     
    this.$add.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-done' ) );
    } );
    this.$calendar = this.shadowRoot.querySelector( 'aa-select[part=calendars]' );
    this.$cancel = this.shadowRoot.querySelector( 'aa-button[part=cancel]' ); 
    this.$cancel.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      if( this._changed ) {
        if( this._data === null ) {
          const response = confirm( 'Are you sure you want to discard this new event?' );
          if( response ) {
            this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );                    
          }
        } else {
          const response = confirm( 'Are you sure you want to discard your changes?' );
          if( response ) {
            this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );                    
          }
        }
      } else {
        this.dispatchEvent( new CustomEvent( 'aa-cancel' ) );                            
      }
    } );
    this.$delete = this.shadowRoot.querySelector( 'aa-button[part=delete]' );
    this.$delete.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-delete', {
        detail: {
          id: this._data.id
        }
      } ) );
    } );
    this.$ends = this.shadowRoot.querySelector( 'aa-date-picker[part=ends]' );         
    this.$ends.addEventListener( 'aa-change', () => {
      this.$ends.invalid = this.$ends.valueAsDate.getTime() < this.$starts.valueAsDate.getTime() ? true : false;
      this.$add.disabled = this.$ends.invalid;      
    } );
    this.$ends.addEventListener( 'aa-open', () => {
      this.$starts.open = false;      
    } );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$location = this.shadowRoot.querySelector( 'aa-input[part=location]' );
    this.$location.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.$add.disabled = !this.validate();
    } );    
    this.$notes = this.shadowRoot.querySelector( 'aa-textarea[part=notes]' );    
    this.$notes.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.$add.disabled = !this.validate();
    } );    
    this.$starts = this.shadowRoot.querySelector( 'aa-date-picker[part=starts]' );
    this.$starts.addEventListener( 'aa-change', () => {
      this.$ends.valueAsDate = new Date( this.$starts.valueAsDate.getTime() );

      /*
      if( this.$starts.valueAsDate.getTime() > this.$ends.valueAsDate.getTime() ) {
        this.$ends.valueAsDate = new Date( this.$starts.valueAsDate.getTime() );
      }
      */
    } );
    this.$starts.addEventListener( 'aa-open', () => {
      this.$ends.open = false;      
    } );
    this.$title = this.shadowRoot.querySelector( 'aa-input[part=title]' );
    this.$title.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.$add.disabled = !this.validate();
    } );    
    this.$url = this.shadowRoot.querySelector( 'aa-input[part=url]' );
    this.$url.addEventListener( 'aa-change', () => {
      this._changed = true;
      this.$add.disabled = !this.validate();
    } );    
  }

  focus() {
    this.$title.focus();
  }

  reset() {
    this._data = null;
    this._changed = false;

    const now = new Date();

    this.$add.label = 'Add';
    this.$add.disabled = true;
    this.$title.value = null;
    this.$location.value = null;
    this.$starts.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
    this.$starts.open = false;
    this.$ends.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
    this.$ends.open = false;
    this.$url.value = null;
    this.$notes.value = null;
  }

  validate() {
    return this.$title.value === null ? false : true;
  }

   // When attributes change
  _render() {
    this.$label.text = `${this._data === null ? 'New' : 'Edit'} Event`;
    this.$delete.hidden = this._data === null ? true : false;
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
    this._upgrade( 'calendars' );      
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
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
  get calendars() {
    return this._calendars.length === 0 ? null : this._calendars;
  }

  set calendars( value ) {
    this._calendars = value === null ? [] : [... value];
    this.$calendar.data = this._calendars;
  }

  get data() {
    const now = new Date();

    return {
      id: this._data === null ? self.crypto.randomUUID() : this._data.id,
      createdAt: this._data === null ? now : this._data.createdAt,
      updatedAt: now,
      calendarId: this.$calendar.value,
      startsAt: this.$starts.valueAsDate,
      endsAt: this.$ends.valueAsDate,
      summary: this.$title.value,
      location: this.$location.value,
      latitude: null,
      longitude: null,
      url: this.$url.value,
      description: this.$notes.value
    };
  }

  set data( value ) {
    this._data = value === null ? null : structuredClone( value );
    this._changed = false;

    this.$add.label = 'Done';
    this.$title.value = this._data.summary;
    this.$location.value = this._data.location;
    this.$starts.valueAsDate = this._data.startsAt;
    this.$ends.valueAsDate = this._data.endsAt;
    this.$calendar.value = this._data.calendarId;
    this.$url.value = this._data.url;
    this.$notes.value = this._data.description;

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
}

window.customElements.define( 'aa-event-form', AAEventForm );
