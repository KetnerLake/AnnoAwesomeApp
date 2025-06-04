export default class AACalendarDetails extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-checkbox[part=check] {
          pointer-events: none;
          --checkbox-color: #0082ff;
        }

        aa-hbox[part=buttons] {
          height: 50px;
        }

        aa-label[part=label] {
          padding-left: 16px; 
          padding-top: 64px; 
          margin-bottom: 26px;          
        }

        aa-vbox[part=groups] {
          flex-basis: 0; 
          flex-grow: 1; 
          margin: 0 16px 16px 16px;
        }

        button[part=colors] {
          align-items: center;
          appearance: none;
          background: none;
          background-color: #ffffff; 
          border: none;
          border-radius: 4px; 
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 12px; 
          height: 36px; 
          outline: none;
          padding: 0 16px 0 16px; 
          -webkit-tap-highlight-color: transparent;                     
        }
      </style>
      <aa-label part="label" size="xl" text="Calendars" weight="bold"></aa-label>
      <aa-vbox gap="l" part="groups">
        <aa-calendar-section label="My Awesome">
          <aa-button label="Hide All" slot="count"></aa-button>
          <aa-vbox part="mine"></aa-vbox>
        </aa-calendar-section>
        <aa-calendar-section label="Shared Awesome">
          <aa-button label="Hide All" slot="count"></aa-button>
          <aa-vbox part="shared"></aa-vbox>          
        </aa-calendar-section>
        <aa-calendar-section label="Public Awesome" notes="Hiding a shared or public calendar does not make it private.">
          <aa-button label="Hide All" slot="count"></aa-button>
          <aa-vbox part="public"></aa-vbox>
        </aa-calendar-section>                        
        <button centered part="colors">
          <aa-checkbox part="check"></aa-checkbox>
          <aa-label style="--label-cursor: pointer;" text="Use calendar colors"></aa-label>
        </button>
      </aa-vbox>
      <aa-hbox centered part="buttons">
        <aa-button label="Add Calendar" part="add"></aa-button>
        <aa-spacer></aa-spacer>
        <aa-button label="Hide All" part="all"></aa-button>
      </aa-hbox>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 
    
    this._HIDE = 'Hide All';
    this._SHOW = 'Show All';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$add = this.shadowRoot.querySelector( 'aa-button[part=add]' );
    this.$add.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-add' ) );
    } );
    this.$check = this.shadowRoot.querySelector( 'aa-checkbox[part=check]' );
    this.$colors = this.shadowRoot.querySelector( 'button[part=colors]' );
    this.$colors.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$check.checked = !this.$check.checked;
      this.useCalendar = this.$check.checked;
      this.dispatchEvent( new CustomEvent( 'aa-colors', {
        detail: {
          calendar: this.$check.checked
        }
      } ) );
    } );
    this.$hide = this.shadowRoot.querySelector( 'aa-button[part=all]' );
    this.$hide.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$hide.label = this.$hide.label === this._HIDE ? this._SHOW : this._HIDE;      
      this.dispatchEvent( new CustomEvent( 'aa-active', {
        detail: {
          active: this.$hide.label === this._HIDE ? true : false,
          calendars: this._data.map( ( value ) => value.id )
        }
      } ) );
    } );
    this.$my_hide = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 1 ) aa-button' );    
    this.$my_hide.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$my_hide.label = this.$my_hide.label === this._HIDE ? this._SHOW : this._HIDE;
      const group = this._data.filter( ( value ) => value.isShared === false && value.isPublic === false );
      this.dispatchEvent( new CustomEvent( 'aa-active', {
        detail: {
          active: this.$my_hide.label === this._HIDE ? true : false,
          calendars: group.map( ( value ) => value.id )
        }
      } ) );
    } );
    this.$my_group = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 1 )' );
    this.$my_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 1 ) aa-vbox' );
    this.$public_hide = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 ) aa-button' );    
    this.$public_hide.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$public_hide.label = this.$public_hide.label === this._HIDE ? this._SHOW : this._HIDE;      
      const group = this._data.filter( ( value ) => value.isPublic );
      this.dispatchEvent( new CustomEvent( 'aa-active', {
        detail: {
          active: this.$public_hide.label === this._HIDE ? true : false,          
          calendars: group.map( ( value ) => value.id )
        }
      } ) );      
    } );
    this.$public_group = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 )' );    
    this.$public_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 ) aa-vbox' );    
    this.$shared_hide = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 ) aa-button' );        
    this.$shared_hide.addEventListener( this._touch ? 'touchstart' : 'click', () => {
      this.$shared_hide.label = this.$shared_hide.label === this._HIDE ? this._SHOW : this._HIDE;      
      const group = this._data.filter( ( value ) => value.isShared );
      this.dispatchEvent( new CustomEvent( 'aa-active', {
        detail: {
          active: this.$shared_hide.label === this._HIDE ? true : false,          
          calendars: group.map( ( value ) => value.id )
        }
      } ) );      
    } );
    this.$shared_group = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 )' );    
    this.$shared_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 ) aa-vbox' );    
  }

  build( list, data ) {
    while( list.children.length > data.length ) {
      list.children[0].remove();
    } 

    while( list.children.length < data.length ) {
      const element = document.createElement( 'aa-calendar-list-renderer' );
      list.appendChild( element );      
    }    

    for( let c = 0; c < list.children.length; c++ ) {
      list.children[c].data = data[c];
    }
  }

  // When attributes change
  _render() {
    this.$my_list.disabled = this.disabled;
    this.$my_hide.disabled = this.disabled;
    this.$shared_list.disabled = this.disabled;
    this.$shared_hide.disabled = this.disabled;
    this.$public_list.disabled = this.disabled;
    this.$public_hide.disabled = this.disabled;    
    this.$colors.disabled = this.disabled;
    this.$check.disabled = this.disabled;
    this.$add.disabled = this.disabled;
    this.$hide.disabled = this.disabled;
    this.$check.checked = this.useCalendar;
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
    this._upgrade( 'disabled' );      
    this._upgrade( 'hidden' );    
    this._upgrade( 'useCalendar' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'use-calendar'
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

    const mine = this._data.filter( ( value ) => value.isShared === false && value.isPublic === false );
    const shared = this._data.filter( ( value ) => value.isShared === true );    
    const publicly = this._data.filter( ( value ) => value.isPublic === true );    
    
    const mine_active = mine.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );
    this.$my_hide.label = mine_active ? this._HIDE : this._SHOW;

    const shared_active = shared.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );
    this.$shared_hide.label = shared_active ? this._HIDE : this._SHOW;    

    const public_active = publicly.reduce( ( prev, curr ) => curr.isActive === false || prev === false ? false : true, true );
    this.$public_hide.label = public_active ? this._HIDE : this._SHOW;        

    if( mine_active === false || shared_active === false || public_active === false ) {
      this.$hide.label = this._SHOW;
    } else {
      this.$hide.label = this._HIDE;
    }

    this.build( this.$my_list, mine );
    this.build( this.$shared_list, shared ); 
    this.build( this.$public_list, publicly );       

    this.$shared_group.hidden = shared.length === 0 ? true : false;
    this.$public_group.hidden = publicly.length === 0 ? true : false;    

    this.$shared_group.hideNotes = publicly.length === 0 ? false : true;    
    this.$public_group.hideNotes = shared.length === 0 ? false : true;        
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

  get useCalendar() {
    return this.hasAttribute( 'use-calendar' );
  }

  set useCalendar( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'use-calendar' );
      } else {
        this.setAttribute( 'use-calendar', '' );
      }
    } else {
      this.removeAttribute( 'use-calendar' );
    }
  }       
}

window.customElements.define( 'aa-calendar-details', AACalendarDetails );
