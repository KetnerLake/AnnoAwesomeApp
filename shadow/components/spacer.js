export default class AASpacer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-grow: 1;
          position: relative;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        :host( [size=xs] ) {
          min-height: 4px;
          min-width: 4px;
        }

        :host( [size=s] ) {
          min-height: 8px;
          min-width: 8px;
        }

        :host( [size=m] ) {
          min-height: 16px;
          min-width: 16px;
        }        

        :host( [size=l] ) {
          min-height: 24px;
          min-width: 24px;
        }                

        :host( [size=xl] ) {
          min-height: 32px;
          min-width: 32px;
        }        
      </style>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
  }

  // When things change
  _render() {;}

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'hidden' );                      
    this._upgrade( 'size' );                          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'hidden',
      'size'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }        
}

window.customElements.define( 'aa-spacer', AASpacer );
