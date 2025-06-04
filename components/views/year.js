customElements.define( 'aa-year', class extends HTMLElement {
  constructor() {
    super();

    this.CELL_HEIGHT = 40;
    this.CELL_WIDTH = 240;

    this.doEventClick = this.doEventClick.bind( this );
    this.doMonthClick = this.doMonthClick.bind( this );

    this._colors = [
      {name: 'Red', value: '#ff2968'},
      {name: 'Orange', value: '#ff9500'},
      {name: 'Yellow', value: '#ffcc02'},
      {name: 'Green', value: '#63da38'},
      {name: 'Blue', value: '#1badf8'},
      {name: 'Purple', value: '#cc73e1'}
    ];
    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    this.$canvas = this.querySelector( 'canvas' );
    this.$context = this.$canvas.getContext( '2d' );
    this.$headers = this.querySelectorAll( 'header button' );
    this.$sheet = this.querySelector( 'article' );

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'long'
    } );
    const year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();
    for( let m = 0; m < 12; m++ ) {
      this.$headers[m].setAttribute( 'data-month', m );
      this.$headers[m].textContent = formatter.format( new Date( year, m, 1 ) );
    }

    this.draw();
    this.show( 'today', 'instant' );
  }

  doEventClick( evt ) {
    this.setAttribute( 'selected-item', evt.currentTarget.getAttribute( 'data-id' ) );
    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        id: evt.currentTarget.getAttribute( 'data-id' )
      }
    } ) );
  }        

  doMonthClick( evt ) {
    const month = parseInt( evt.target.getAttribute( 'data-month' ) );
    this.dispatchEvent( new CustomEvent( 'aa-month', {
      detail: {
        month: month,
        width: evt.target.clientWidth
      }
    } ) );
  }        

  draw( year = null ) {
    if( year === null ) {
      year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();
    }

    const today = new Date();
    let index = 0;

    for( let m = 0; m < 12; m++ ) {
      for( let d = 0; d < 31; d++ ) {
        const current = new Date( year, m, d + 1 );
        const date = d + 1;
        const month = m;

        let isToday = false;
        if( today.getFullYear() === current.getFullYear() &&
          today.getMonth() === current.getMonth() &&
          today.getDate() === current.getDate() ) {
          isToday = true;
        }             

        const days = new Date( year, m + 1, 0 );          
        const isOutside = ( d + 1 ) > days.getDate() ? true : false;

        const track = this.week( current );
        let week = null;
        if( track !== index || d === 0 ) {
          index = track;
          week = index;
        }

        const weekend = current.getDay();

        const row = date - 1;                        

        if( isOutside ) {
          this.$context.fillStyle = '#ffffff';
        } else {
          this.$context.fillStyle = weekend === 0 || weekend === 6 ? '#f5f5f5' : '#ffffff';
        }              

        this.$context.beginPath();
        this.$context.rect( 
          month * this.CELL_WIDTH, 
          row * this.CELL_HEIGHT, 
          this.CELL_WIDTH, 
          this.CELL_HEIGHT 
        );
        this.$context.fill();              

        this.$context.beginPath();
        this.$context.fillStyle = isToday ? '#0082ff' : 'rgba( 0, 0, 0, 0 )';
        this.$context.ellipse(
          ( month * this.CELL_WIDTH ) + 21,
          ( row * this.CELL_HEIGHT ) + 20,
          18, 
          18,
          0, 
          -3.14,
          3.14
        );
        this.$context.fill();              

        this.$context.fillStyle = isToday || isOutside ? '#ffffff' : '#272727';
        this.$context.font = `${isToday ? 600 : 400} 16px IBM Plex Sans`;
        this.$context.textAlign = 'center';
        this.$context.textBaseline = week === null ? 'middle' : 'top';
        const fix = this.$context.measureText( date ).fontBoundingBoxDescent; 
        // const fix = this.$context.measureText( date ).actualBoundingBoxDescent / 2;        
        this.$context.fillText( 
          date, 
          ( month * this.CELL_WIDTH ) + 21, 
          ( row * this.CELL_HEIGHT ) + ( week === null ? 22 : 8 )
        );       
        
        if( week !== null && isOutside === false ) {
          this.$context.fillStyle = isToday ? '#ffffff' : '#868686';
          this.$context.font = '12px IBM Plex Sans';
          this.$context.textAlign = 'center';
          this.$context.textBaseline = 'top';
          this.$context.fillText( 
            week, 
            ( month * this.CELL_WIDTH ) + 21, 
            ( row * this.CELL_HEIGHT ) + 23 
          );            
        }

        this.$context.strokeStyle = '#e5e5e5';                      

        if( date < 31 && isOutside === false ) {
          this.$context.beginPath();
          this.$context.moveTo( 
            month * this.CELL_WIDTH, 
            ( row * this.CELL_HEIGHT ) + this.CELL_HEIGHT - 0.50
          );
          this.$context.lineTo( 
            ( month * this.CELL_WIDTH ) + this.CELL_WIDTH, 
            ( row * this.CELL_HEIGHT ) + this.CELL_HEIGHT - 0.50
          );
          this.$context.stroke();
        }   
        
        if( month < 11 ) {
          this.$context.beginPath();
          this.$context.moveTo( 
            ( month * this.CELL_WIDTH ) + this.CELL_WIDTH - 0.50, 
            row * this.CELL_HEIGHT
          );
          this.$context.lineTo( 
            ( month * this.CELL_WIDTH ) + this.CELL_WIDTH - 0.50, 
            ( row * this.CELL_HEIGHT ) + this.CELL_HEIGHT
          );        
          this.$context.stroke();
        }
      }
    }          
  }

  show( id = null, behavior = 'smooth' ) {
    if( id === 'top' ) {
      year_view.scrollTo( {
        top: 0, 
        behavior: behavior
      } );
    } else if( id === 'start' ) {
      year_view.scrollTo( {
        left: 0, 
        top: 0, 
        behavior: behavior
      } );
    } else if( id === 'today' ) {      
      const year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();      
      const today = new Date();

      if( year === today.getFullYear() ) {
        year_view.scrollTo( {
          left: ( today.getMonth() * 240 ) - ( year_view.clientWidth / 2 ),
          top: ( today.getDate() * 40 ) - ( year_view.clientHeight / 2 ),
          behavior: behavior
        } );
      }
    } else {
      const event = this.$sheet.querySelector( `button[data-id="${id}"]` );
      event.scrollIntoView( {
        behavior: behavior,
        block: 'center',
        inline: 'center'
      } );
    }
  }

  // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
  week( date ) {
    date = new Date( Date.UTC( date.getFullYear(), date.getMonth(), date.getDate() ) );
    date.setUTCDate( date.getUTCDate() + 4 - ( date.getUTCDay() || 7 ) );
    const yearStart = new Date( Date.UTC( date.getUTCFullYear(), 0, 1 ) );
    return Math.ceil( ( ( ( date - yearStart ) / 86400000 ) + 1 ) / 7 );
  }        

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {    
    this._upgrade( 'data' );

    for( let h = 0; h < this.$headers.length; h++ ) {
      this.$headers[h].addEventListener( this._touch, this.doMonthClick );
    }
  }

  disconnectedCallback() {
    for( let h = 0; h < this.$headers.length; h++ ) {
      this.$headers[h].removeEventListener( this._touch, this.doMonthClick );
    }    
  }

  static get observedAttributes () {
    return [
      'selected-item',
      'use-calendar-color',
      'value'
    ];
  }   

  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'selected-item' ) {
      const events = this.$sheet.querySelectorAll( 'button' );
      const item = this.hasAttribute( 'selected-item' ) ? this.getAttribute( 'selected-item' ) : null;

      for( let e = 0; e < events.length; e++ ) {              
        if( events[e].getAttribute( 'data-id' ) === item ) {
          events[e].classList.add( 'selected' );
        } else {
          events[e].classList.remove( 'selected' );            
        }
      }      
    }

    if( name === 'use-calendar-color' ) {
      for( let c = 0; c < this.$sheet.children.length; c++ ) {
        let color = this.$sheet.children[c].getAttribute( 'data-month-color' );

        if( this.hasAttribute( 'use-calendar-color' ) ) {
          color = this.$sheet.children[c].getAttribute( 'data-calendar-color' );
        }        

        this.$sheet.children[c].style.setProperty( '--event-active-background-color', color );        
        this.$sheet.children[c].style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );                
        this.$sheet.children[c].style.setProperty( '--event-inactive-background-color', color + '4d' );                      
      }
    }

    if( name === 'value' ) {
      const year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();
      this.draw( year );
    }
  }

  get data() {
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {        
    this._data = value === null ? [] : [... value];  

    while( this.$sheet.children.length > this._data.length ) {
      this.$sheet.children[0].removeEventListener( this._touch, this.doEventClick );
      this.$sheet.children[0].remove();
    }

    while( this.$sheet.children.length < this._data.length ) {
      const element = document.createElement( 'button' );
      const summary = document.createElement( 'span' );
      const location = document.createElement( 'span' );

      element.appendChild( summary );
      element.appendChild( location );
      element.addEventListener( this._touch, this.doEventClick );                        

      this.$sheet.appendChild( element );
    }

    const year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();          
    let index = 0;

    for( let m = 0; m < 12; m++ ) {
      const month = this._data.filter( ( value ) => value.startsAt.getMonth() === m && value.startsAt.getFullYear() === year ? true : false );
      month.map( ( value ) => {
        value.start = value.startsAt.getDate();
        value.duration = ( value.endsAt.getDate() - value.startsAt.getDate() ) + 1;
        return value;
      } );
      const tiles = calendarTiler.tileAppointments( month, {
        delineator: 'duration',
        usesDuration: true
      } );

      for( let a = 0; a < tiles.sortedAppointments.length; a++ ) {
        let color = this._colors[m % this._colors.length].value;                                  

        const left = ( m * this.CELL_WIDTH ) + 43;
        const column = this.CELL_WIDTH - 44;              
        const event = this.$sheet.children[index];
        event.setAttribute( 'data-id', tiles.sortedAppointments[a].id );
        event.setAttribute( 'data-calendar-color', tiles.sortedAppointments[a].color );
        event.setAttribute( 'data-month-color', color );              
        event.children[0].textContent = tiles.sortedAppointments[a].summary;
        event.style.left = ( left + ( column * tiles.positions[a].x ) ) + 'px';
        event.style.width = ( column * tiles.positions[a].dx ) + 'px';
        event.style.top = ( ( tiles.positions[a].y - 1 ) * this.CELL_HEIGHT ) + 'px';
        event.style.height = ( ( tiles.positions[a].dy * this.CELL_HEIGHT ) - 1 ) + 'px';

        if( this.hasAttribute( 'use-calendar-color' ) ) {
          color = tiles.sortedAppointments[a].color;
        }

        event.style.setProperty( '--event-active-background-color', color );        
        event.style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );                
        event.style.setProperty( '--event-inactive-background-color', color + '4d' );                      

        index = index + 1;
      }
    }
  }
} );