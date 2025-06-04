const TOUCH = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';      
const COLORS = [
  {name: 'Red', value: '#ff2968'},
  {name: 'Orange', value: '#ff9500'},
  {name: 'Yellow', value: '#ffcc02'},
  {name: 'Green', value: '#63da38'},
  {name: 'Blue', value: '#1badf8'},
  {name: 'Purple', value: '#cc73e1'}
];      

const navigation = document.querySelector( 'aa-navigation' );
const header = document.querySelector( 'aa-header' );
const footer = document.querySelector( 'aa-footer' );
const left_panel = document.querySelector( '#left' );
const left_stack = document.querySelector( '#left aa-stack' );
const right_panel = document.querySelector( '#right' );

const event_details = document.querySelector( 'aa-event-details' );      
const event_form = document.querySelector( 'aa-event-form' );
const event_list = document.querySelector( '#left aa-event-list' );
const event_dialog = document.querySelector( '#event' );
const event_search = document.querySelector( '#right aa-event-list' );
const event_stack = document.querySelector( '#event aa-stack' );

const calendar_dialog = document.querySelector( '#calendar' );
const calendar_details = document.querySelector( 'aa-calendar-details' );
const calendar_form = document.querySelector( 'aa-calendar-form' );

const account_dialog = document.querySelector( '#account' );
const account_form = document.querySelector( 'aa-account-form' );

const year_view = document.querySelector( 'aa-year' );

/*
 * Navigation
 */

navigation.addEventListener( 'aa-account', () => {
  browseEvent( year_store, sort_store )
  .then( ( data ) => {
    event_search.data = null;
    right_panel.classList.add( 'hidden' );
    year_view.data = data;
    footer.setAttribute( 'count' , data.length );
    blocker( true );
    account_dialog.showModal();
    account_form.focus();
  } );
} );
navigation.addEventListener( 'aa-calendar', ( evt ) => controlsChange( evt ) );
navigation.addEventListener( 'aa-event', ( evt ) => controlsChange( evt ) );  
navigation.addEventListener( 'aa-add', () => {
  browseEvent( year_store, sort_store )
  .then( ( data ) => {
    year_view.data = data;
    year_view.removeAttribute( 'selected-item' );
    event_search.data = null;
    right_panel.classList.add( 'hidden' );
    footer.setAttribute( 'count', data.length );    
    return browseCalendar( 'asc' );
  } )
  .then( ( data ) => {
    event_form.data = null;
    event_form.calendars = data;
    event_stack.setAttribute( 'selected-index', 0 );   
    blocker( true );
    event_dialog.showModal();
    event_form.focus();
  } );
} );    
navigation.addEventListener( 'aa-search', () => {
  event_search.data = null;
  // footer.setAttribute( 'count', data.length );    
  left_panel.classList.add( 'hidden' );
  right_panel.classList.remove( 'hidden' );
  window.localStorage.removeItem( 'awesome_drawer' );   
} );
navigation.addEventListener( 'aa-change', ( evt ) => {
  if( evt.detail.value === null ) {
    browseEvent( year_store, sort_store )
    .then( ( data ) => {
      year_view.data = data;
      footer.setAttribute( 'count', data.length );             
      event_search.data = null;      
    } );
  } else {
    browseEvent( null, sort_store, true, false, null, evt.detail.value )
    .then( ( data ) => {
      const events = data.filter( ( value ) => value.startsAt.getFullYear() === year_store ? true : false );
      year_view.data = events;
      footer.setAttribute( 'count', events.length );       
      event_search.data = data;
    } );
  }
} );
navigation.addEventListener( 'aa-cancel', () => {
  event_search.data = null;
  right_panel.classList.add( 'hidden' );

  browseEvent( year_store, sort_store )
  .then( ( data ) => {
    year_view.data = data;
    footer.setAttribute( 'count', data.length );
  } );
} );

/*
 * Header 
 */ 

header.addEventListener( 'aa-previous', ( evt ) => headerChange( evt.detail.year ) );
header.addEventListener( 'aa-next', ( evt ) => headerChange( evt.detail.year ) );
header.addEventListener( 'aa-today', ( evt ) => {
  year_view.setAttribute( 'value', evt.detail.year );  
  year_view.show( 'today' );
  headerChange( evt.detail.year );
} );
header.addEventListener( 'aa-year', () => {
  year_view.show( 'start' );
} );

/*
 * Account
 */

// Dialog
account_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === account_dialog ) {
    account_dialog.close();
  }
} );
account_dialog.addEventListener( 'close', () => {
  blocker( false );
} );

// Form
account_form.addEventListener( 'aa-demo', () => {
  blocker( false );
  account_dialog.close();
} );
account_form.addEventListener( 'aa-export', () => {
  browseCalendar( 'asc', true, true )
  .then( ( data ) => {
    const blob = new Blob( [JSON.stringify( data )], {type: 'application/json'} ); 
    const link = document.createElement( 'a' );
    link.setAttribute( 'href', window.URL.createObjectURL( blob ) );
    link.setAttribute( 'download', 'awesome.json' );
    document.body.appendChild( link );
    link.click();

    setTimeout( ( link ) => {
      link.remove();
    }, 5000, link );
  } );
} );
account_form.addEventListener( 'aa-sign-in', ( evt ) => {
  const response = confirm( 'Individual accounts not yet available. Sponsor feature development. Learn more?' );
  if( response ) window.open( 'https://patreon.com/krhoyt', '_blank' );
} );
account_form.addEventListener( 'aa-sign-up', () => {
  window.open( 'https://patreon.com/krhoyt', '_blank' );
  blocker( false );        
  account_dialog.close();
} );      

/*
 * Event 
 */ 

// Dialog
event_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === event_dialog ) {
    event_dialog.close();
  }
} );
event_dialog.addEventListener( 'close', () => {
  blocker( false );
  // year_view.removeAttribute( 'selected-item' );    
  // event_list.removeAttribute( 'selected-item' );
  // event_search.removeAttribute( 'selected-item' );  
} );

// Form
event_form.addEventListener( 'aa-cancel', () => {
  blocker( false );
  event_dialog.close();
  event_form.data = null;
  // year_view.removeAttribute( 'selected-item' );
  // event_list.removeAttribute( 'selected-item' );
  // event_search.removeAttribute( 'selected-item' );
} );
event_form.addEventListener( 'aa-delete', ( evt ) => {
  deleteEvent( evt.detail.id )
  .then( () => browseEvent( year_store, sort_store ) )
  .then( ( data ) => {
    year_view.data = data;
    event_list.data = data;
    blocker( false );
    event_dialog.close();
    footer.setAttribute( 'count', data.length );
  } );
} );
event_form.addEventListener( 'aa-done', () => {
  const event = structuredClone( event_form.data );
  editEvent( event )
  .then( () => browseEvent( null, sort_store ) )
  .then( ( data ) => {
    // TODO: What to display in case of calendar being hidden/inactive
    event_list.data = data;
    event_list.setAttribute( 'selected-item', event.id );    

    if( event.startsAt.getFullYear() !== year_store ) {
      year_store = event.startsAt.getFullYear();
      window.localStorage.setItem( 'awesome_year', year_store );
      header.setAttribute( 'year', year_store );
    }

    const events = data.filter( ( value ) => value.startsAt.getFullYear() === year_store ? true : false );
    year_view.setAttribute( 'value', year_store );
    year_view.data = events;

    if( events.length > 0 ) {
      year_view.setAttribute( 'selected-item', event.id );
      year_view.show( event.id );
    }

    footer.setAttribute( 'count', events.length  );        
    blocker( false );
    event_dialog.close();    
  } );
} );

// Details
event_details.addEventListener( 'aa-change', ( evt ) => {
  readEvent( evt.detail.id )
  .then( ( data ) => {
    data.calendarId = evt.detail.calendarId;
    return editEvent( data );
  } )
  .then( () => browseEvent( year_store, sort_store ) )
  .then( ( data ) => {
    year_view.data = data;
    // year_view.setAttribute( 'selected-item', evt.detail.id );
    event_list.data = data;
    event_list.setAttribute( 'selected-item', evt.detail.id );
    footer.setAttribute( 'count', data.length );
  } );
} );
event_details.addEventListener( 'aa-close', ( evt ) => {
  event_dialog.close();

  if( evt.detail.id !== null ) {
    year_view.setAttribute( 'selected-item', evt.detail.id );
  }
} );
event_details.addEventListener( 'aa-delete', ( evt ) => {
  deleteEvent( evt.detail.id )
  .then( () => browseEvent( null, sort_store ) )
  .then( ( data ) => {
    event_list.data = data;
    event_list.removeAttribute( 'selected-item' );
    const events = data.filter( ( value ) => value.startsAt.getFullYear() === year_store ? true : false );
    year_view.data = events;
    year_view.removeAttribute( 'selected-item' );
    footer.setAttribute( 'count', events.length );    
    blocker( false );
    event_dialog.close();
  } );
} );
event_details.addEventListener( 'aa-edit', ( evt ) => {
  browseCalendar( 'asc' )
  .then( ( data ) => {
    event_form.calendars = data;
    return readEvent( evt.detail.id );
  } )
  .then( ( data ) => {
    event_form.data = data;
    event_stack.setAttribute( 'selected-index', 0 );
    event_form.focus();
  } );
} );
event_details.addEventListener( 'aa-file', ( evt ) => {
  readAttachment( evt.detail.id )
  .then( ( data ) => {
    // https://stackoverflow.com/questions/28197179/javascript-open-pdf-in-new-tab-from-byte-array
    const file = new Blob( [data.data], {type: data.type} );
    const url = URL.createObjectURL( file );
    window.open( url );
  } );
} );

// List
event_list.addEventListener( 'aa-add', () => {
  console.log( 'EVENT_LIST_ADD' );
  browseCalendar( 'asc' )
  .then( ( data ) => {
    event_form.data = null;
    event_form.calendars = data;
    event_stack.setAttribute( 'selected-index', 0 );
    blocker( true );
    event_dialog.showModal();
    event_form.focus();
  } )
} );    
event_list.addEventListener( 'aa-change', ( evt ) => {
  browseCalendar( 'asc' )
  .then( ( data ) => {
    event_details.calendars = data;
    return readEvent( evt.detail.id );
  } )
  .then( ( data ) => {
    // event_details.data = data;
    // event_stack.setAttribute( 'selected-index', 1 );
    // blocker( true );
    // event_dialog.showModal();      

    if( data.startsAt.getFullYear() !== year_store ) {
      year_store = data.startsAt.getFullYear();
      window.localStorage.setItem( 'awesome_year', year_store );
      year_view.setAttribute( 'value', year_store );
    }

    return browseEvent( year_store, sort_store );          
  } )
  .then( ( data ) => {
    header.setAttribute( 'year', year_store );
    year_view.data = data;
    year_view.setAttribute( 'selected-item', evt.detail.id );
    year_view.show( evt.detail.id );    
    footer.setAttribute( 'count', data.length );    
  } );
} );
event_list.addEventListener( 'aa-sort', () => {
  sort_store = sort_store === 'asc' ? 'desc' : 'asc';
  window.localStorage.setItem( 'awesome_sort', sort_store );
  browseEvent( null, sort_store )
  .then( ( data ) => {
    event_list.data = data;
    event_list.setAttribute( 'selected-item', event_list.getAttribute( 'selected-item' ) );
    year_view.setAttribute( 'selected-item', event_list.getAttribute( 'selected-item' ) );
 } );
} );

/*
 * Calendar
 */

// Dialog
calendar_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === calendar_dialog ) {
    calendar_dialog.close();
  }
} );
calendar_dialog.addEventListener( 'close', () => {
  blocker( false );
} );

// Form
calendar_form.addEventListener( 'aa-cancel', () => {
  blocker( false );
  calendar_dialog.close();
} );
calendar_form.addEventListener( 'aa-delete', ( evt ) => {
  blocker( false );
  calendar_dialog.close();
  calendar_form.data = null;  

  deleteCalendar( evt.detail.id )
  .then( () => browseCalendar( 'asc' ) )
  .then( ( data ) => {
    calendar_details.data = data;
    return browseEvent( year_store, sort_store );
  } )
  .then( ( data ) => {
    event_list.data = data;
    year_view.data = data;
    footer.setAttribute( 'count', data.length );    
  } );
} );
calendar_form.addEventListener( 'aa-done', () => {
  blocker( false );
  calendar_dialog.close();

  addCalendar( calendar_form.data )
  .then( () => browseCalendar( 'asc' ) )
  .then( ( data ) => {
    calendar_details.data = data;
    return browseEvent( year_store, sort_store );
  } )
  .then( ( data ) => {
    event_list.data = data;
    year_view.data = data;
    footer.setAttribute( 'count', data.length );
  } );
} );
calendar_form.addEventListener( 'aa-export', ( evt ) => {
  let name = null;

  readCalendar( evt.detail.id )
  .then( ( data ) => {
    name = data.name;
    return browseEvent( year_store, sort_store, false, false, evt.detail.id );
  } )
  .then( ( data ) => {
    const keys = Object.keys( data[0] );
    let output = keys.join( ',' ) + '\n';

    for( let d = 0; d < data.length; d++ ) {
      let row = '';
      for( let v = 0; v < keys.length; v++ ) {
        row = row + data[d][keys[v]] + ',';
      }
      output = output + row.substring( 0, row.length - 1 ) + '\n';
    }

    const blob = new Blob( [output], {type: 'text/csv'} );
    const link = document.createElement( 'a' );
    link.setAttribute( 'href', window.URL.createObjectURL( blob ) );
    link.setAttribute( 'download', `${name}.csv` );
    document.body.appendChild( link );
    link.click();

    setTimeout( ( link ) => {
      link.remove();
    }, 5000, link );    
  } );
} );
calendar_form.addEventListener( 'aa-sign-up', () => {
  const result = confirm( 'Not yet available. You can sponsor additional development. Learn more?' );
  if( result ) window.open( 'https://patreon.com/krhoyt', '_blank' );
} );

// Details
calendar_details.addEventListener( 'aa-active', ( evt ) => {
  if( !evt.detail.hasOwnProperty( 'calendars' ) ) {
    evt.detail.calendars = [evt.detail.id];
  }

  db.calendar.bulkGet( evt.detail.calendars )
  .then( ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      data[d].isActive = evt.detail.active;
    }

    return db.calendar.bulkPut( data );      
  } )
  .then( () => browseCalendar( 'asc' ) )
  .then( ( data ) => {
    calendar_details.data = data;
    return browseEvent( null, sort_store );      
  } )
  .then( ( data ) => {
    event_list.data = data;  
    const events = data.filter( ( value ) => value.startsAt.getFullYear() === year_store ? true : false );
    year_view.data = events;
    footer.setAttribute( 'count', events.length );
  } );
} );
calendar_details.addEventListener( 'aa-add', () => {
  calendar_form.colors = COLORS;
  calendar_form.data = null;
  calendar_form.removeAttribute( 'can-delete' );
  blocker( true );
  calendar_dialog.showModal();
  calendar_form.focus();
} );
calendar_details.addEventListener( 'aa-colors', ( evt ) => {
  if( evt.detail.checked ) {
    window.localStorage.setItem( 'awesome_colors', true );
    event_list.setAttribute( 'use-calendar-color', '' );
    year_view.setAttribute( 'use-calendar-color', '' );
    event_search.setAttribute( 'use-calendar-color', '' );
  } else {
    window.localStorage.removeItem( 'awesome_colors' );
    event_list.removeAttribute( 'use-calendar-color' );
    year_view.removeAttribute( 'use-calendar-color' );
    event_search.removeAttribute( 'use-calendar-color' );
  }
} );
calendar_details.addEventListener( 'aa-info', ( evt ) => {
  browseCalendar( 'asc' )
  .then( ( data ) => {
    if( data.length > 1 ) {
      calendar_form.setAttribute( 'can-delete', '' );
    } else {
      calendar_form.removeAttribute( 'can-delete' );
    }

    return readCalendar( evt.detail.id );
  } )
  .then( ( data ) => {
    calendar_form.colors = COLORS;
    calendar_form.data = data;
    blocker( true );
    calendar_dialog.showModal();
    calendar_form.focus();
  } );
} );
calendar_details.addEventListener( 'aa-hide', async ( evt ) => {
  const keys = Object.keys( evt.detail.active );

  for( let k = 0; k < keys.length; k++ ) {
    const calendar = await readCalendar( keys[k] );
    calendar.isActive = evt.detail.active[keys[k]];
    await editCalendar( calendar );
  }

  browseCalendar( 'asc' ).then( ( data ) => calendar_details.data = data );
} );

/*
 * Year
 */

year_view.addEventListener( 'aa-change', ( evt ) => {
  browseCalendar( 'asc' )
  .then( ( data ) => {
    event_details.calendars = data;
    return readEvent( evt.detail.id );
  } )
  .then( ( data ) => {
    event_list.setAttribute( 'selected-item', data.id );
    event_list.show( data.id );
    event_details.data = data;
    event_stack.setAttribute( 'selected-index', 1 );
    blocker( true );
    event_dialog.showModal();
  } );
} );
year_view.addEventListener( 'aa-month', () => {  
  year_view.show( 'top' );
} );

/*
 * Search 
 */

event_search.addEventListener( 'aa-change', ( evt ) => {
  readEvent( evt.detail.id )
  .then( ( data ) => {
    // event_details.data = data;
    // event_stack.setAttribute( 'selected-index', 1 );
    // blocker( true );
    // event_dialog.showModal();      

    if( data.startsAt.getFullYear() !== year_store ) {
      year_store = data.startsAt.getFullYear();
      window.localStorage.setItem( 'awesome_year', year_store );
      year_view.setAttribute( 'value', year_store );

      return browseEvent( year_store, sort_store );          
    } else {
      year_view.setAttribute( 'selected-item', evt.detail.id );
      year_view.show( evt.detail.id );      
    }
  } )
  .then( ( data ) => {
    header.setAttribute( 'year', year_store );    

    if( data !== null ) {
      year_view.data = data;
      footer.setAttribute( 'count', data.length );
    }

    year_view.setAttribute( 'selected-item', evt.detail.id );
    year_view.show( evt.detail.id );
  } );
} );

/*
 * Setup
 */

// Colors
let color_store = window.localStorage.getItem( 'awesome_colors' );
color_store = color_store === null ? false : true;

if( color_store ) {
  calendar_details.setAttribute( 'use-calendar-color', '' );
  event_list.setAttribute( 'use-calendar-color', '' );
  year_view.setAttribute( 'use-calendar-color', '' );
  event_search.setAttribute( 'use-calendar-color', '' );
} else {
  calendar_details.removeAttribute( 'use-calendar-color' );  
  event_list.removeAttribute( 'use-calendar-color' );  
  year_view.removeAttribute( 'use-calendar-color' );
  event_search.removeAttribute( 'use-calendar-color', '' );  
}

// Drawer
let left_store = window.localStorage.getItem( 'awesome_drawer' );

if( left_store === null ) {
  left_panel.classList.add( 'hidden' );
  calendar_details.removeAttribute( 'mode' );
} else {
  left_store = parseInt( left_store );
  left_panel.classList.remove( 'hidden' );
  left_stack.setAttribute( 'selected-index', left_store );
  navigation.setAttribute( 'mode', left_store === 0 ? 'calendar' : 'event' );
}

// Sort
let sort_store = window.localStorage.getItem( 'awesome_sort' );
if( sort_store === null ) {
  sort_store = 'desc';
  window.localStorage.setItem( 'awesome_sort', sort_store ); 
}

// Session
let session_store = window.localStorage.getItem( 'awesome_token' );      

// Year
let year_store = window.localStorage.getItem( 'awesome_year' );
if( year_store === null ) {
  year_store = new Date().getFullYear();  
  window.localStorage.setItem( 'awesome_year', year_store );        
} else {
  year_store = parseInt( year_store );
}

header.setAttribute( 'year', year_store );
year_view.setAttribute( 'value', year_store );

// Database
const db = new Dexie( 'AnnoAwesome' );
db.version( 8 ).stores( {
  event: 'id, calendarId, startsAt',
  calendar: 'id, publicAt, sharedAt',
  attachment: 'id, eventId'
} );

browseCalendar( 'asc' )
.then( async ( data ) => {
  if( data.length === 0 ) {
    const id = self.crypto.randomUUID();
    const now = Date.now();
    const url = await tiny( crypto.randomUUID() );
    await editCalendar( {
      id: id,
      createdAt: new Date( now ),
      updatedAt: new Date( now ),
      name: 'Calendar',
      color: '#1badf8',
      sharedAt: null,
      isPublic: false,
      isActive: true,
      isShared: false,
      url: url
    } );
    data = await browseCalendar( 'asc' );
  }

  calendar_details.data = data;

  return browseEvent( null, sort_store );
} )
.then( ( data ) => {
  event_list.colors = COLORS;
  event_list.data = data;  
  const events = data.filter( ( value ) => value.startsAt.getFullYear() === year_store ? true : false );
  year_view.colors = COLORS;  
  console.log( events );
  year_view.data = events;
  footer.setAttribute( 'count', events.length );  
  event_search.colors = COLORS;
  event_search.data = null;
} );      

/* 
 * Helpers
 */

function blocker( disabled = true ) {
  if( disabled ) {
    navigation.setAttribute( 'disabled', '' );
    header.setAttribute( 'disabled', '' ); 
    footer.setAttribute( 'disabled', '' ); 
    calendar_details.setAttribute( 'disabled', '' );    
    event_list.setAttribute( 'disabled', '' );
  } else {
    navigation.removeAttribute( 'disabled', '' );
    header.removeAttribute( 'disabled', '' ); 
    footer.removeAttribute( 'disabled', '' ); 
    calendar_details.removeAttribute( 'disabled', '' );    
    event_list.removeAttribute( 'disabled' );          
  }
}

function controlsChange( evt ) {
  const calendar = evt.detail.calendar;
  const event = evt.detail.event;

  event_search.data = null;
  right_panel.classList.add( 'hidden' );

  if( calendar === true && event === false ) {
    left_stack.setAttribute( 'selected-index', 0 );
    left_panel.classList.remove( 'hidden' );
    window.localStorage.setItem( 'awesome_drawer', 0 );        
  } else if( calendar === false && event === true ) {
    left_stack.setAttribute( 'selected-index', 1 );
    left_panel.classList.remove( 'hidden' );
    window.localStorage.setItem( 'awesome_drawer', 1 );            
  } else if( calendar === false && event === false ) {
    left_panel.classList.add( 'hidden' );
    left_stack.setAttribute( 'selected-index', 0 );
    window.localStorage.removeItem( 'awesome_drawer' );    
  } 

  browseEvent( year_store, sort_store )
  .then( ( data ) => {
    year_view.data = data;
    footer.setAttribute( 'count', data.length );
  } );  
}      

function headerChange( year ) {
  year_store = year;
  window.localStorage.setItem( 'awesome_year', year_store );
 
  header.setAttribute( 'year', year_store );
  year_view.setAttribute( 'value', year_store );
  
  const selected = year_view.hasAttribute( 'selected-item' ) ? year_view.getAttribute( 'selected-item' ) : null;

  browseEvent( year_store, sort_store )
  .then( ( data ) => {
    year_view.data = data;    
    if( selected !== null ) {
      year_view.setAttribute( 'selected-item', selected );
    }

    footer.setAttribute( 'count', data.length );
  } );   
}      

async function tiny( value ) {
  const encoder = new TextEncoder();
  const data = encoder.encode( value );
  const buffer = await window.crypto.subtle.digest( 'SHA-1', data );
  const hashArray = Array.from( new Uint8Array( buffer) );
  const hashHex = hashArray.map( ( byte ) => byte.toString( 16 ).padStart( 2, '0' ) ).join( '' );
  const shortHexDigest = hashHex.substring( 0, 6 );          

  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';        
  let randomInt = Math.floor( Math.random() * Math.pow( 62, 6 ) );
  let converted = '';

  while( randomInt > 0 ) {
    const digit = randomInt % 62;
    converted = alphabet[digit] + converted;
    randomInt = Math.floor( randomInt / 62 );
  }

  return converted.substring( 2, '0' ) + shortHexDigest;
}

/*
 * Data access
 */

// Attachment
function readAttachment( id ) {
  return db.attachment.get( id );
}

// Calendar
function browseCalendar( sort = null, events = false, attachments = false ) {
  return db.calendar.toArray() 
  .then( async ( data ) => {
    if( sort !== null ) {
      data.sort( ( a, b ) => {
        if( sort === 'desc' ) {
          if( a.name > b.name ) return -1;
          if( a.name < b.name ) return 1;
        } else {
          if( a.name > b.name ) return 1;
          if( a.name < b.name ) return -1;          
        }

        return 0;
      } );
    }

    if( events ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].events = await db.event.where( {calendarId: data[d].id} ).toArray();

        if( data[d].events.length === 0 ) {
          data[d].events = null;
        } else {
          if( attachments ) {
            for( let e = 0; e < data[d].events.length; e++ ) {
              data[d].events[e].attachments = await db.attachment.where( {eventId: data[d].id} ).toArray();
              
              if( data[d].events[e].attachments.length === 0 ) {
                data[d].events[e].attachments = null;
              }
            }
          }
        }        
      }
    }
      
    return data;
  } );
}

function readCalendar( id, events = false, attachments = false ) {
  let response = null;

  return db.calendar.get( id )
  .then( ( data ) => {
    response = structuredClone( data );

    if( events ) {
      return db.event.where( {calendarId: response.id} ).toArray();
    }
      
    return response;
  } )
  .then( async ( data ) => {
    if( !Array.isArray( data ) ) return response;

    if( attachments ) {
      for( let d = 0; d < data.length; d++ ) {
        attach = await db.attachment.where( {eventId: data[d].id} ).toArray();
        data[d].attachments = attach.length === 0 ? null : [... attach];
      }  
    }

    response.events = data.length === 0 ? [] : [... data];
    
    return response;
  } );
}

function editCalendar( calendar ) {
  return db.calendar.put( calendar )
  .then( () => editPublicCalendar( calendar.id) );
}

function addCalendar( calendar ) {
  return db.calendar.put( calendar )
  .then( () => editPublicCalendar( calendar.id ) );
}

function deleteCalendar( id ) {
  let isPublic = false;
  let url = null;

  return db.calendar.get( id )
  .then( ( data ) => {
    url = data.url;
    isPublic = data.isPublic;
    return db.event.where( {calendarId: id} ).toArray();
  } )
  .then( async ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      await deleteEvent( data[d].id );
    }

    return db.calendar.delete( id );
  } )
  .then( () => {
    return isPublic ? deletePublicCalendar( url ) : null;
  } );
}

// Event
function browseEvent( year = null, sort = null, active = true, reverse = false, calendar = null, search = null ) {
  let activated = [];
  let calendars = [];
  let starts = null;
  let ends = null;

  if( year !== null ) {
    starts = new Date( year, 0, 1 );
    ends = new Date( year + 1, 0, 1 );
  }

  return db.calendar.toArray()
  .then( ( data ) => {
    calendars = [... data];
    activated = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );

    if( year === null ) {
      return db.event.toArray();
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
    }
  } )
  .then( ( data ) => {
    if( active ) {
      data = data.filter( ( value ) => activated.includes( value.calendarId ) );
    }

    for( let d = 0; d < data.length; d++ ) {
      data[d].color = calendars.reduce( ( value, curr ) => data[d].calendarId === curr.id ? curr.color : value, null );
    }

    if( sort !== null ) {
      data.sort( ( a, b ) => {
        if( sort === 'desc' ) {
          if( a.startsAt < b.startsAt ) return 1;
          if( a.startsAt > b.startsAt ) return -1;          
        } else {
          if( a.startsAt < b.startsAt ) return -1;
          if( a.startsAt > b.startsAt ) return 1;                    
        }

        return 0;
      } );

      /*
      data.sort( ( a, b ) => {
        const first = a.startsAt.getFullYear() + '-' + ( a.startsAt.getMonth() + 1 ) + '-' + a.startsAt.getDate();
        const second = b.startsAt.getFullYear() + '-' + ( b.startsAt.getMonth() + 1 ) + '-' + b.startsAt.getDate();    
    
        if( sort === 'desc' ) {
          if( first < second ) return 1;
          if( first > second ) return -1;        
        } else {
          if( first < second ) return -1;
          if( first > second ) return 1;        
        }
    
        // Pin like colors to the left side
        // Inverse sort pins colors to the right side
        if( a.color < b.color ) return 1;
        if( a.color > b.color ) return -1;
    
        if( a.summary < b.summary ) return -1;
        if( a.summary > b.summary ) return 1;    
    
        return 0;
      } );      
      */
    }

    if( calendar !== null ) {
      data = data.filter( ( value ) => value.calendarId === calendar ? true : false );
    }

    if( search !== null ) {
      data = data.filter( ( value ) => {
        const query = search.toLowerCase();
        let match = false;
  
        if( value.summary !== null ) {
          if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
        }
    
        if( value.description !== null ) {
          if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
        }
    
        return match;
      } );
    }

    return reverse ? data.reverse() : data;
  } );
}

function readEvent( id ) { 
  let event = null;
  return db.event.get( id )
  .then( ( data ) => {
    event = structuredClone( data );
    return db.calendar.get( event.calendarId );
  } )
  .then( ( data ) => {
    event.color = data.color;
    return db.attachment.where( {eventId: event.id} ).toArray();
  } )
  .then( ( data ) => {
    event.attachments = data.length === 0 ? null : [... data];
    return event;
  } );
}

function editEvent( event ) {
  return db.attachment.where( {eventId: event.id} ).toArray()
  .then( ( data ) => db.attachment.bulkDelete( data.map( ( value ) => value.id ) ) )
  .then( () => db.attachment.bulkPut( event.attachments === null ? [] : event.attachments ) )
  .then( () => {
    delete event.attachments;
    return db.event.put( event );
  } )
  .then( () => editPublicCalendar( event.calendarId ) )
  .then( ( data ) => {
    return data;
  } );
}

function addEvent( event ) {
  return db.attachment.bulkPut( event.attachments )
  .then( () => {
    delete event.attachments;
    return db.event.put( event );
  } )
  .then( () => editPublicCalendar( event.calendarId ) );
}  

function deleteEvent( id ) {
  let calendar = null;

  return db.event.get( id )
  .then( ( data ) => {
    calendar = data.calendarId;
    return db.attachment.where( {eventId: id} ).toArray();
  } )
  .then( ( data ) => {
    data = data.map( ( value ) => value.id );
    return db.attachment.bulkDelete( data );
  } )
  .then( () => db.event.delete( id ) )
  .then( () => editPublicCalendar( calendar ) );
}  

// External
function editPublicCalendar( id ) {
  const calendar = null;

  return db.calendar.get( id )
  .then( ( data ) => {
    if( data.isPublic ) {
      calendar = structuredClone( data );
      return db.event.where( {calendarId: calendar.id} );
    } else {
      return null;
    }
  } )
  .then( ( data ) => {
    if( data === null ) return null;

    calendar.events = [... data];
    calendar.events = calendar.events.map( ( value ) => {
      value.color = calendar.color;
      return value;
    } );      

    return fetch( '/api/public', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( calendar )
    } );
  } )
  .then( ( response ) => {
    return response === null ? null : response.json();
  } );
}

function deletePublicCalendar( url ) {
  return fetch( '/api/public', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify( {url: url} )
  } )
  .then( ( response ) => response.json() );
}
