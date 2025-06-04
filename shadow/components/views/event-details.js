export default class AAEventDetails extends HTMLElement {
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

        aa-button[part=delete] {
          margin: 4px 0 4px 0; 
          --button-color: red;          
        }

        aa-button[part=edit] {
          justify-self: flex-end; 
          --button-padding: 0;
        }

        aa-hbox[part=end_box] {
          margin: 8px 0 0 16px;          
        }

        aa-vbox[part=notes_box],
        aa-vbox[part=url_box] {
          margin: 8px 0 8px 16px;          
        }

        aa-label[part=description] {
          margin-top: -5px;
          --label-line-height: 21px;
        }

        aa-label[part=description],
        aa-label[part=end],
        aa-label[part=end_label],
        aa-label[part=start],        
        aa-label[part=start_label] {
          --label-color: #8e8e8e;
        }

        aa-label[part=title] {
          flex-basis: 0; 
          flex-grow: 1;
        }

        aa-label[part=location_label],
        aa-link[part=location_link] {
          margin: 0 0 0 16px;
        }
      </style>
      <aa-hbox centered style="padding: 8px 16px 0 16px;">
        <aa-label part="title" weight="bold"></aa-label>            
        <aa-button label="Edit" part="edit"></aa-button>
      </aa-hbox>
      <aa-link label="Location" part="location_link"></aa-link>
      <aa-label label="Location" part="location_label"></aa-label>          
      <aa-spacer size="m"></aa-spacer>
      <aa-hbox gap="s" style="margin: 0 0 0 16px;">
        <aa-label part="start_label" text="from"></aa-label>
        <aa-label part="start"></aa-label>          
      </aa-hbox>
      <aa-hbox gap="s" part="end_box">
        <aa-label part="end_label" text="to"></aa-label>            
        <aa-label part="end"></aa-label>                      
      </aa-hbox>
      <aa-spacer size="m"></aa-spacer>
      <aa-divider></aa-divider>
      <aa-select label="Calendar" label-field="name" part="calendar" value-field="id"></aa-select>
      <aa-divider part="calendar_divider"></aa-divider>      
      <aa-vbox gap="m" part="url_box">
        <aa-label text="URL"></aa-label>
        <aa-link part="url_link"></aa-link>
      </aa-vbox>
      <aa-divider part="url_divider"></aa-divider>
      <aa-vbox gap="m" part="notes_box">
        <aa-label part="notes" text="Notes"></aa-label>
        <aa-label part="description"></aa-label>
      </aa-vbox>
      <aa-divider part="notes_divider"></aa-divider>
      <aa-map part="map" style="border-radius: 4px; margin: 16px;"></aa-map>
      <aa-divider hidden part="map_divider"></aa-divider>          
      <aa-button label="Delete Event" part="delete"></aa-button>      
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$boxEnds = this.shadowRoot.querySelector( 'aa-hbox[part=end_box]' );
    this.$boxNotes = this.shadowRoot.querySelector( 'aa-vbox[part=notes_box]' );    
    this.$boxUrl = this.shadowRoot.querySelector( 'aa-vbox[part=url_box]' );
    this.$calendar = this.shadowRoot.querySelector( 'aa-select[part=calendar]' );
    this.$calendar.addEventListener( 'aa-change', ( evt ) => {
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          id: this._data.id,
          calendarId: evt.detail.value
        }
      } ) );
    } );
    this.$delete = this.shadowRoot.querySelector( 'aa-button[part=delete]' );
    this.$delete.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      const response = confirm( 'Are you sure you want to delete this calendar?' );
      if( !response ) return;
      this.dispatchEvent( new CustomEvent( 'aa-delete', {
        detail: {
          id: this._data.id
        }
      } ) );      
    } );
    this.$divCalendar = this.shadowRoot.querySelector( 'aa-divider[part=calendar_divider]' );
    this.$divMap = this.shadowRoot.querySelector( 'aa-divider[part=map_divider]' );
    this.$divNotes = this.shadowRoot.querySelector( 'aa-divider[part=notes_divider]' );
    this.$labelLocation = this.shadowRoot.querySelector( 'aa-label[part=location_label]' ); 
    this.$linkLocation = this.shadowRoot.querySelector( 'aa-link[part=location_link]' );
    this.$edit = this.shadowRoot.querySelector( 'aa-button[part=edit]' );
    this.$edit.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-edit', {
        detail: {
          id: this._data.id
        }
      } ) );
    } );
    this.$ends = this.shadowRoot.querySelector( 'aa-label[part=end]' );
    this.$map = this.shadowRoot.querySelector( 'aa-map[part=map]' );
    this.$notes = this.shadowRoot.querySelector( 'aa-label[part=description]' );
    this.$starts = this.shadowRoot.querySelector( 'aa-label[part=start]' );
    this.$startsLabel = this.shadowRoot.querySelector( 'aa-label[part=start_label]' );    
    this.$title = this.shadowRoot.querySelector( 'aa-label[part=title]' );
    this.$url = this.shadowRoot.querySelector( 'aa-link[part=url_link]' );
  }

  // When attributes change
  _render() {;}

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
      name: this.$name.value,
      color: null,
      isShared: false,
      isActive: this._data === null ? true : this._data.isActive,
      isPublic: this.$public.checked
    };
  }

  set data( value ) {
    this._data = structuredClone( value );

    // Title
    this.$title.text = this._data.summary;

    // Location
    this.$labelLocation.text = this._data.location;
    this.$labelLocation.hidden = this._data.latitude === null ? false : true;
    this.$linkLocation.label = this._data.location;
    this.$linkLocation.hidden = this._data.latitude === null ? true : false;    
    // TODO: HREF to Google Maps (lat, lng)

    // Starts/ends
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      day: 'numeric',
      weekday: 'long',
      month: 'short',
      year: 'numeric'
    } );      
  
    if( this._data.startsAt.getDate() === this._data.endsAt.getDate() &&
        this._data.startsAt.getFullYear() === this._data.endsAt.getFullYear() ) {
      this.$startsLabel.hidden = true;
      this.$starts.hidden = false;
      this.$starts.text = formatter.format( this._data.startsAt );
      this.$boxEnds.hidden = true;
    } else {
      this.$startsLabel.hidden = false;
      this.$starts.hidden = false;
      this.$starts.text = formatter.format( this._data.startsAt );
      this.$ends.text = formatter.format( this._data.endsAt );
      this.$boxEnds.hidden = false;
    }

    // Calendar
    this.$calendar.value = this._data.calendarId;

    // URL
    this.$divCalendar.hidden = this._data.url === null ? true : false;
    this.$boxUrl.hidden = this._data.url === null ? true : false;
    this.$url.label = this._data.url;
    this.$url.href = this._data.url;    

    // Notes
    this.$boxNotes.hidden = this._data.description === null ? true : false;
    this.$notes.text = this._data.description;
    this.$divNotes.hidden = this._data.description === null ? true : false;

    // Map
    this.$map.hidden = this._data.latitude === null ? true : false;
    this.$divMap.hidden = this._data.latitude === null ? true : false;

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

window.customElements.define( 'aa-event-details', AAEventDetails );
