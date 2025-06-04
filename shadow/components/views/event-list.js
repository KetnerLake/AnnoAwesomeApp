export default class AAEventList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          overflow: auto;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=empty] {
          align-items: center;
          height: 100%;
          justify-content: center;
        }

        aa-event-list-renderer {
          cursor: pointer;
        }
      </style>
      <div part="list"></div>
      <div part="empty">
        <slot></slot>
      </div>
    `;

    // Private
    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false; 

    // Events
    this.doItemClick = this.doItemClick.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$empty = this.shadowRoot.querySelector( 'div[part=empty]' );
    this.$list = this.shadowRoot.querySelector( 'div[part=list]' );
  }

  doItemClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    this.selectedIndex = index;

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        id: this._data[index].id
      }
    } ) );
  }

  // When attributes change
  _render() {
    for( let c = 0; c < this.$list.children.length; c++ ) {
      if( this.selectedIndex !== null ) {
        this.$list.children[c].selected = this.selectedIndex === c ? true : false;
      } else {
        this.$list.children[c].selected = false;
      }

      this.$list.children[c].disabled = this.disabled;
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
    this._upgrade( 'disabled' );          
    this._upgrade( 'hidden' );    
    this._upgrade( 'selectedIndex' );              
    this._upgrade( 'selectedItem' );                  
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'selected-index'
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
    
    this.$list.style.display = this._data.length === 0 ? 'none' : '';
    this.$empty.style.display = this._data.length === 0 ? 'flex' : 'none';

    while( this.$list.children.length > this._data.length ) {
      this.$list.children[0].removeEventListener( this._touch ? 'touchstart' : 'click', this.doItemClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const element = document.createElement( 'aa-event-list-renderer' );
      element.addEventListener( this._touch ? 'touchstart' : 'click', this.doItemClick );
      this.$list.appendChild( element );
    }

    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].setAttribute( 'data-index', c );
      this.$list.children[c].data = this._data[c];
    }
  }  

  get selectedItem() {
    if( this.selectedIndex === null ) return null;
    return this._data[this.selectedIndex].id
  }

  set selectedItem( id ) {
    this.selectedIndex = this._data.findIndex( ( value ) => value.id === id );
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
  
  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }           
}

window.customElements.define( 'aa-event-list', AAEventList );
