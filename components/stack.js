customElements.define( 'aa-stack', class extends HTMLElement {
  constructor() {
    super();

    for( let c = 0; c < this.children.length; c++ ) {
      if( c === 0 ) {
        this.children[c].removeAttribute( 'hidden' );
      } else {
        this.children[c].setAttribute( 'hidden', '' );
      }
    }    
  }

  static get observedAttributes () {
    return [
      'selected-index'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'selected-index' ) {
      const index = parseInt( newValue );
      for( let c = 0; c < this.children.length; c++ ) {
        if( c === index ) {
          this.children[c].removeAttribute( 'hidden' );
        } else {
          this.children[c].setAttribute( 'hidden', '' );
        }
      }
    }
  }        
} );      
