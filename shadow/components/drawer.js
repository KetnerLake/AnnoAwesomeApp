export default class AADrawer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: #f2f2f9;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          width: 300px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        } 

        :host( [placement=start] ) {
          border-right: solid 1px #c6c6c8;
        }

        :host( [placement=end] ) {
          border-left: solid 1px #c6c6c8;
        }        
      </style>
      <slot></slot>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  hide() {
    this.animate( [
      {minWidth: '285px', width: '285px'},      
      {minWidth: 0, width: 0}
    ], {
      duration: 250,
      fill: 'forwards'
    } ).finished.then( () => {
      this.style.display = 'none';
      this.hidden = true;
    } );    
  }

  show() {
    this.style.display = 'flex';
    this.animate( [
      {minWidth: 0, width: 0},
      {minWidth: '285px', width: '285px'}
    ], {
      duration: 250,
      fill: 'forwards'
    } ).finished.then( () => {
      this.hidden = false
    } );
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
    this._upgrade( 'concealed' );  
    this._upgrade( 'data' );      
    this._upgrade( 'hidden' );    
    this._upgrade( 'placement' );        
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'placement'
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

  get placement() {
    if( this.hasAttribute( 'placement' ) ) {
      return this.getAttribute( 'placement' );
    }

    return null;
  }

  set placement( value ) {
    if( value !== null ) {
      this.setAttribute( 'placement', value );
    } else {
      this.removeAttribute( 'placement' );
    }
  }  
}

window.customElements.define( 'aa-drawer', AADrawer );
