import AAHBox from "../hbox.js";
import AALabel from "../label.js";
import AAVBox from "../vbox.js";

export default class AAEventListRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          border-radius: 4px;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding: 8px;
          margin: 0 8px 0 8px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox[part=first] {
          align-items: baseline;
        }

        aa-hbox[part=first],
        aa-hbox[part=second] {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-hbox[part=second] {
          margin: 4px 0 0 0;
        }

        aa-vbox[part=calendar] {
          background: #ffffff, #f443364d;
          border-radius: 4px;
          height: 36px;
          width: 36px;
        }

        aa-vbox[part=details] {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-label {
          --label-cursor: pointer;
        }

        aa-label[part=date] {
          --label-color: #B71C1C;          
        }

        aa-label[part=month] {
          --label-color: #B71C1C;
          --label-text-transform: uppercase;
        }

        aa-label[part=ends] {
          --label-color: #8a8b8e;
        }

        aa-label[part=location] {
          flex-basis: 0;
          flex-grow: 1;
          --label-color: #8a8b8e;
        }

        aa-label[part=summary] {
          flex-basis: 0;
          flex-grow: 1;
        }

        div[part=backdrop] {
          background-color: #ffffff;
          border-radius: 4px;
        }

        div[part=divider] {
          background: #bdbdc3;
          bottom: 0;
          height: 1px;
          left: 60px;
          position: absolute;
          right: 0;
        }        

        div[part=selected] {
          align-items: center;
          background: transparent;
          border-radius: 4px;
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding: 8px;          
        }

        :host( [outdated] ) aa-label[part=summary],
        :host( [outdated] ) aa-label[part=location],
        :host( [outdated] ) aa-label[part=label],
        :host( [outdated] ) aa-label[part=ends] {
          --label-color: #a9a9b0;
        }

        :host( [selected] ) {
          background: #dad9e1;
        }
      </style>
      <div part="backdrop">
        <aa-vbox centered justified part="calendar">
          <aa-label part="date" text="6" weight="bold"></aa-label>
          <aa-label part="month" size="xs"></aa-label>
        </aa-vbox>
      </div>
      <aa-vbox part="details">
        <aa-hbox gap="m" part="first">
          <aa-label part="summary" truncate weight="bold"></aa-label>
          <aa-label part="label" size="s" text="Ends"></aa-label>
        </aa-hbox>
        <aa-hbox gap="m" part="second">
          <aa-label part="location" size="s" truncate></aa-label>
          <aa-label part="ends" size="s"></aa-label>
        </aa-hbox>        
      </aa-vbox>
    `;

    // Private
    this._colors = ['#ff2968', '#ff9500', '#ffcc02', '#63da38', '#1badf8', '#cc73e1'];
    /*
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
    */
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$calendar = this.shadowRoot.querySelector( 'aa-vbox[part=calendar]' );
    this.$date = this.shadowRoot.querySelector( 'aa-label[part=date]' );
    this.$ends = this.shadowRoot.querySelector( 'aa-label[part=ends]' );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$location = this.shadowRoot.querySelector( 'aa-label[part=location]' );
    this.$month = this.shadowRoot.querySelector( 'aa-label[part=month]' );
    this.$summary = this.shadowRoot.querySelector( 'aa-label[part=summary]' );
  }

   // When attributes change
  _render() {
    if( this._data === null ) return;

    /*
    let parts = this._data.startsAt.split( '-' );
    const starts = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );
    */    

    let formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'short'
    } ).format( this._data.startsAt );        

    const month = this._data.startsAt.getMonth();
    const color = this._data.hasOwnProperty( 'color' ) ? this._data.color : this._colors[month % this._colors.length];

    this.$calendar.style.setProperty( 'background', color + '4d' );    
    this.$date.style.setProperty( '--label-color', `hsl( from ${color} h s calc( l - 20 ) )` );        
    this.$date.text = this._data.startsAt.getDate();
    this.$month.style.setProperty( '--label-color', `hsl( from ${color} h s calc( l - 20 ) )` );            
    this.$month.text = formatted;
    
    /*
    parts = this._data.endsAt.split( '-' );
    const ends = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );
    */

    this.$summary.text = this._data.summary;
    this.$label.hidden = this._data.startsAt.getDate() === this._data.endsAt.getDate() ? true : false;
    this.$location.text = this._data.location;

    if( this._data.startsAt.getDate() === this._data.endsAt.getDate() &&
        this._data.startsAt.getMonth() === this._data.endsAt.getMonth() ) {
      this.$ends.concealed = true;
      this.$ends.text = 'X';
    } else {
      formatted = new Intl.DateTimeFormat( navigator.language, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      } ).format( this._data.endsAt );
      this.$ends.text = formatted;            
      this.$ends.concealed = false;  
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
    this._upgrade( 'outdated' );          
    this._upgrade( 'selected' );              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'outdated',
      'selected'
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

    /*
    const parts = this._data.endsAt.split( '-' );
    const ends = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );
    */

    const ends = new Date( this._data.endsAt.getTime() );
    ends.setMilliseconds( 999 );
    ends.setSeconds( 59 );    
    ends.setMinutes( 59 );
    ends.setHours( 23 );

    this.outdated = ends.getTime() < Date.now() ? true : false;    

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

  get outdated() {
    return this.hasAttribute( 'outdated' );
  }

  set outdated( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'outdated' );
      } else {
        this.setAttribute( 'outdated', '' );
      }
    } else {
      this.removeAttribute( 'outdated' );
    }
  }  

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  
}

window.customElements.define( 'aa-event-list-renderer', AAEventListRenderer );
