export default class AASelect extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox {
          height: 36px;
          padding: 0 16px 0 16px;
        }

        aa-icon {
          --icon-color:
            invert( 73% ) 
            sepia( 0% ) 
            saturate( 0% ) 
            hue-rotate( 327deg ) 
            brightness( 87% ) 
            contrast( 89% );          
        }

        aa-label[part=label] {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-label[part=name] {        
          margin: 0 8px 0 8px;
          --label-color: #9e9e9e;          
        }

        div {
          border-radius: 12px;
          height: 12px;
          width: 12px;
        }

        select {
          height: 36px;
          left: 0;
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          -webkit-tap-highlight-color: transparent;            
        }
      </style>
      <aa-hbox centered>
        <aa-label part="label"></aa-label>
        <div part="color"></div>
        <aa-label part="name"></aa-label>
        <aa-icon size="xs" src="./img/chevron-expand.svg"></aa-icon>
      </aa-hbox>
      <select></select>
    `;

    // Private
    this._data = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$color = this.shadowRoot.querySelector( 'div[part=color]' );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$name = this.shadowRoot.querySelector( 'aa-label[part=name]' );
    this.$select = this.shadowRoot.querySelector( 'select' );
    this.$select.addEventListener( 'change', () => {
      this.$color.style.backgroundColor = this._data[this.$select.selectedIndex].color;
      this.$name.text = this.$select.selectedOptions[0].innerText;
      this.value = this.$select.value;

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
  }

  // When things change
  _render() {
    this.$label.text = this.label;
    this.$select.value = this.value;
    this.$name.text = this.$select.selectedOptions.length > 0 ? this.$select.selectedOptions[0].innerText : null;
  }

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
    this._upgrade( 'concealed' );                          
    this._upgrade( 'data' );                          
    this._upgrade( 'hidden' );                      
    this._upgrade( 'label' );                          
    this._upgrade( 'labelField' );                          
    this._upgrade( 'value' );                          
    this._upgrade( 'valueField' );                              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label',
      'label-field',
      'value',
      'value-field'
    ];
  }

  // Observed tag attribute has changed
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
    while( this.$select.children.length > this._data.length ) {
      this.$select.children[0].remove();
    }

    while( this.$select.children.length < this._data.length ) {
      const option = document.createElement( 'option' );
      this.$select.appendChild( option );
    }

    const label = this.labelField === null ? 'label' : this.labelField;
    const field = this.valueField = null ? 'value' : this.valueField;

    for( let c = 0; c < this.$select.children.length; c++ ) {
      this.$select.children[c].innerText = this._data[c][label];
      this.$select.children[c].value = this._data[c][field];      
    }

    this.$select.selectedIndex = 0;
    this.$color.style.backgroundColor = this._data[this.$select.selectedIndex].color;
    this.$name.text = this.$select.selectedOptions[0].innerText;
    this.value = this.$select.value;
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

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
    }
  }

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  

  get valueField() {
    if( this.hasAttribute( 'value-field' ) ) {
      return this.getAttribute( 'value-field' );
    }

    return null;
  }

  set valueField( value ) {
    if( value !== null ) {
      this.setAttribute( 'value-field', value );
    } else {
      this.removeAttribute( 'value-field' );
    }
  }  
}

window.customElements.define( 'aa-select', AASelect );
