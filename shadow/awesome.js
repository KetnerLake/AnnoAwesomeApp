/*
// Constants
*/

const TOUCH = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

// Labels: Red, Orange, Yellow, Green, Blue, Purple
// Trident: f89497, ffc996, ffe599 afd8a3, 96c6ec, b7a6dc
// iOS: ff2968, ff9500, ffcc02, 63da38, 1badf8, cc73e1

const db = new Dexie( 'AnnoAwesome' );
db.version( 5 ).stores( {
  event: 'id, calendarId, startsAt',
  calendar: 'id'
} );

/*
// Globals
*/

let calendars = [];
let events = [];
let using = window.localStorage.getItem( 'awesome_colors' ) === 'true' ? true : false;
let lefty = window.localStorage.getItem( 'awesome_drawer' ) === null ? null : parseInt( window.localStorage.getItem( 'awesome_drawer' ) );
let session = window.localStorage.getItem( 'awesome_token' );

/*
// Left 
*/

const pnlLeft = document.querySelector( '#drawer_left' );
const stkLeft = document.querySelector( '#left_stack' );
const pnlCalendars = document.querySelector( 'aa-calendar-details' );
const lstEvents = document.querySelector( '#drawer_events' );

db.event.toArray().then( ( data ) => lstEvents.data = data );

/*
// Header
*/

function headerChange( evt ) {
  db.event.where( 'startsAt' ).between( evt.detail.starts, evt.detail.ends ).toArray()
  .then( ( data ) => {
    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );    
    calYear.data = events;
    lstEvents.data = events;
    pnlFooter.count = events.length;
  } );
}

const pnlHeader = document.querySelector( 'aa-header' );
pnlHeader.addEventListener( 'aa-next', ( evt ) => headerChange( evt ) );
pnlHeader.addEventListener( 'aa-previous', ( evt ) => headerChange( evt ) );
pnlHeader.addEventListener( 'aa-today', ( evt ) => { 
  const today = new Date();
  calYear.value = pnlHeader.year;
  calYear.scrollTo( {
    left: ( today.getMonth() * 200 ) - ( calYear.clientWidth / 2 ),
    top: ( today.getDate() * 36 ) - ( calYear.clientHeight / 2 ),
    behavior: 'smooth'
  } );

  headerChange( evt );
} );

/*
// Year
*/

const calYear = document.querySelector( 'aa-year' );

/*
// Footer
*/

const pnlFooter = document.querySelector( 'aa-footer' );

/* 
// Right
*/

const pnlRight = document.querySelector( '#drawer_right' );
const lstSearch = document.querySelector( '#drawer_search' );

/*
// Controls
*/

function controlsChange( evt ) {
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.events = events;
  pnlFooter.count = events.length;

  if( evt.detail.calendars === true && evt.detail.list === false ) {
    stkLeft.selectedIndex = 0;    
    pnlLeft.hidden = false;
    window.localStorage.setItem( 'awesome_drawer', 0 );        
  } else if( evt.detail.calendars === false && evt.detail.list === true ) {
    stkLeft.selectedIndex = 1;    
    pnlLeft.hidden = false;
    window.localStorage.setItem( 'awesome_drawer', 1 );            
  } else if( evt.detail.calendars === false && evt.detail.list === false ) {
    pnlLeft.hidden = true;
    stkLeft.selectedIndex = 0;
    window.localStorage.removeItem( 'awesome_drawer' );    
  } 
}

const pnlControls = document.querySelector( 'aa-controls' );
pnlControls.addEventListener( 'aa-account', () => {
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.data = events;
  pnlFooter.count = events.length;

  blocker( true );

  dlgAccount.showModal();
  frmAccount.focus();
} );
pnlControls.addEventListener( 'aa-add', () => {
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.data = events;
  pnlFooter.count = events.length;

  frmEvent.data = null;
  frmEvent.calendars = calendars;    

  stkEvent.selectedIndex = 0;  
  blocker( true );

  dlgEvent.classList.add( 'transparent' );
  dlgEvent.showModal();
  frmEvent.focus();
} );
pnlControls.addEventListener( 'aa-calendars', ( evt ) => controlsChange( evt ) );
pnlControls.addEventListener( 'aa-cancel', () => {
  pnlRight.hidden = true;
  lstSearch.data = null;
  calYear.data = events;
  pnlFooter.count = events.length;
} );
pnlControls.addEventListener( 'aa-list', ( evt ) => controlsChange( evt ) );
pnlControls.addEventListener( 'aa-search', ( evt ) => {
  if( evt.detail.value !== null ) {
    const filtered = events.filter( ( value ) => {
      const query = evt.detail.value.toLowerCase();
      let match = false;
  
      if( value.summary !== null ) {
        if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      if( value.description !== null ) {
        if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      return match;
    } );
  
    calYear.data = filtered;
    lstSearch.data = filtered;
    pnlFooter.count = filtered.length;
  } else {
    lstSearch.data = events;
    pnlFooter.count = events.length;
  }

  pnlLeft.hidden = true;
  // btnHeaderCalendars.checked = false;
  // btnHeaderList.checked = false;
  // btnHeaderCancel.hidden = false;  
  pnlRight.hidden = false;

  window.localStorage.removeItem( 'awesome_drawer' );
} );
pnlControls.addEventListener( 'aa-wizard', () => pnlFooter.wizard() );

/*
// Account
*/

const dlgAccount = document.querySelector( '#account' );
const frmAccount = document.querySelector( 'aa-account-form' );

/*
// Event
*/

const dlgEvent = document.querySelector( '#event' );
const frmEvent = document.querySelector( 'aa-event-form' );
const pnlEvent = document.querySelector( 'aa-event-details' );
const stkEvent = document.querySelector( '#event_stack' );

/*
// Calendar
*/

const dlgCalendar = document.querySelector( '#calendar' );
const frmCalendar = document.querySelector( 'aa-calendar-form' );




// Header



lstSearch.addEventListener( 'aa-change', ( evt ) => {
  calYear.selectedItem = evt.detail.id;
  lstSearch.selectedItem = evt.detail.id;

  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    pnlEvent.calendars = calendars;
    pnlEvent.data = event;
    dlgEvent.classList.remove( 'transparent' );
    stkEvent.selectedIndex = 1;
    blocker( true );
    dlgEvent.showModal();
  } );
} );

txtHeaderSearch.addEventListener( 'focus', () => {
  if( txtHeaderSearch.value !== null ) {
    const filtered = events.filter( ( value ) => {
      const query = txtHeaderSearch.value.toLowerCase();
      let match = false;
  
      if( value.summary !== null ) {
        if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      if( value.description !== null ) {
        if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      return match;
    } );
  
    calYear.data = filtered;
    lstSearch.data = filtered;
    pnlFooter.count = filtered.length;
  } else {
    lstSearch.data = events;
    pnlFooter.count = events.length;
  }

  pnlLeft.hidden = true;
  btnHeaderCalendars.checked = false;
  btnHeaderList.checked = false;
  pnlRight.hidden = false;
  btnHeaderCancel.hidden = false;

  window.localStorage.removeItem( 'awesome_drawer' );
} );

txtHeaderSearch.addEventListener( 'aa-change', () => {
  if( txtHeaderSearch.value === null ) {
    calYear.data = events;
    lstSearch.data = events;
    pnlFooter.count = events.length;
    return;
  }

  const filtered = events.filter( ( value ) => {
    const query = txtHeaderSearch.value.toLowerCase();
    let match = false;

    if( value.summary !== null ) {
      if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
    }

    if( value.description !== null ) {
      if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
    }

    return match;
  } );

  calYear.data = filtered;
  lstSearch.data = filtered;
  pnlFooter.count = filtered.length;
} );

// Account
dlgAccount.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === dlgAccount ) {
    blocker( false );
    dlgAccount.close();
    frmAccount.reset();
  }
} );

dlgAccount.addEventListener( 'close', () => {
  blocker( false );
  dlgAccount.close();
  frmAccount.reset();
} );

frmAccount.addEventListener( 'aa-demo', () => {
  blocker( false )
  dlgAccount.close();
} );

frmAccount.addEventListener( 'aa-signin', ( evt ) => {
  const user = {
    email: evt.detail.email,
    password: evt.detail.password
  };

  /*
  accountLogin( user )
  .then( ( data ) => {
    session = data;
    window.localStorage.setItem( 'awesome_token', session );
    frmAccount.reset();
    blocker( false );
    dlgAccount.close();
  } );
  */

  /*
  return fetch( `${KETNER_LAKE_API}/account/login`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify( user )
  } )
  .then( ( response ) => response.text() )
  .then( ( data ) => {
    return data.substring( 1, data.length - 1 );  
  } );
  */
} );

// Event
dlgEvent.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === dlgEvent ) {
    blocker( false );
    dlgEvent.close();
    frmEvent.reset();
    calYear.selectedItem = null;    
    lstEvents.selectedIndex = null;
    lstSearch.selectedIndex = null;
  }
} );

dlgEvent.addEventListener( 'close', () => {
  blocker( false );
  dlgEvent.close();
  frmEvent.reset();
  calYear.selectedItem = null;
  lstEvents.selectedIndex = null;  
  lstSearch.selectedIndex = null;
} );

frmEvent.addEventListener( 'aa-cancel', () => {
  blocker( false );
  dlgEvent.close();
  frmEvent.reset();
  calYear.selectedItem = null;
  lstEvents.selectedIndex = null;
  lstSearch.selectedIndex = null;
} );

frmEvent.addEventListener( 'aa-delete', ( evt ) => {
  db.event.delete( evt.detail.id )
  .then( () => {
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    calYear.data = events;
    lstEvents.data = events;
    blocker( false );
    dlgEvent.close();
    frmEvent.reset();
    // pnlEvent.data = null;
    pnlFooter.count = events.length;
  } );
} );

frmEvent.addEventListener( 'aa-done', () => {
  const id = frmEvent.data.id;

  db.event.put( frmEvent.data )
  .then( () => {
    blocker( false );
    dlgEvent.close();
    calYear.selectedItem = null;
    lstEvents.selectedIndex = null;
    lstSearch.selectedIndex = null;
    frmEvent.reset();

    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    calYear.data = events;
    lstEvents.data = events;
    pnlFooter.count = events.length;
  } );
} );

// Details
pnlEvent.addEventListener( 'aa-change', ( evt ) => {
  db.event.where( {id: evt.detail.id} ).first()
  .then( ( data ) => {
    data.calendarId = evt.detail.calendarId;
    return db.event.put( data );
  } )
  .then( () => {
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }
    
    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    calYear.data = events;
    calYear.selectedItem = evt.detail.id;
    lstEvents.data = events;
    lstEvents.selectedItem = evt.detail.id;
    pnlFooter.count = events.length;
  } );
} );

pnlEvent.addEventListener( 'aa-delete', ( evt ) => {
  db.event.delete( evt.detail.id )
  .then( () => {
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }    
    
    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    calYear.data = events;
    calYear.selectedItem = null;
    lstEvents.selectedIndex = null;
    lstSearch.selectedIndex = null;
    lstEvents.data = events;
    blocker( false );
    dlgEvent.close();
    frmEvent.reset();
    // pnlEvent.data = null;
    pnlFooter.count = events.length;
  } );
} );

pnlEvent.addEventListener( 'aa-edit', ( evt ) => {
  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    frmEvent.canDelete = true;
    frmEvent.calendars = calendars;
    frmEvent.data = event;
    // lblFormLabel.text = 'Edit Event';
    // btnFormAdd.label = 'Done';
    stkEvent.selectedIndex = 0;
    dlgEvent.classList.add( 'transparent' );
  } );
} );

// Drawers
lstEvents.addEventListener( 'aa-change', ( evt ) => {
  calYear.selectedItem = evt.detail.id;
  lstEvents.selectedItem = evt.detail.id;

  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    pnlEvent.calendars = calendars;
    pnlEvent.data = event;
    dlgEvent.classList.remove( 'transparent' );
    stkEvent.selectedIndex = 1;
    blocker( true );
    dlgEvent.showModal();
  } );
} );

pnlCalendars.addEventListener( 'aa-add', () => {
  frmCalendar.data = null;
  // frmCalendar.canDelete = false;
  blocker( true );
  dlgCalendar.showModal();
  frmCalendar.focus();
} );

pnlCalendars.addEventListener( 'aa-hide', async () => {
  for( let c = 0; c < calendars.length; c++ ) {
    const calendar = await db.calendar.get( calendars[c].id );
    calendar.isActive = btnCalendarsHide.label === HIDE_ALL ? false : true;
    await db.calendar.put( calendar );
  }

  db.calendar.toCollection().sortBy( 'name' )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    pnlCalendars.data = calendars;
    btnCalendarsHide.label = btnCalendarsHide.label === HIDE_ALL ? SHOW_ALL : HIDE_ALL;
  } );
} );

dlgCalendar.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === dlgCalendar ) {
    blocker( false );
    dlgCalendar.close();
    // frmCalendar.reset();
    frmCalendar.data = null;
  }
} );

dlgCalendar.addEventListener( 'close', () => {
  blocker( false );
  dlgCalendar.close();
  // frmCalendar.reset();
  frmCalendar.data = null;
} );

frmCalendar.addEventListener( 'aa-cancel', () => {
  // frmCalendar.reset();
  frmCalendar.data = null;
  blocker( false );
  dlgCalendar.close();
} );

frmCalendar.addEventListener( 'aa-delete', () => {
  blocker( false );
  dlgCalendar.close();

  const id = frmCalendar.data.id;

  db.event.where( {calendarId: id} ).toArray()
  .then( ( data ) => {
    const keys = data.map( ( value ) => value.id );
    return db.event.bulkDelete( keys );
  } )
  .then( () => {
    return db.calendar.delete( id );
  } )
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );     
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    pnlCalendars.data = calendars;
    // frmCalendar.reset();
    frmCalendar.data = null;

    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    lstEvents.data = events;
    calYear.data = events;
    pnlFooter.count = events.length;
  } );
} );

frmCalendar.addEventListener( 'aa-done', () => {
  blocker( false );
  dlgCalendar.close();

  db.calendar.put( frmCalendar.data )
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );  

    calendars = [... data];
    pnlCalendars.data = calendars;
    // frmCalendar.reset();
    frmCalendar.data = null;

    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    lstEvents.data = events;
    calYear.data = events;
    pnlFooter.count = events.length;
  } );
} );

pnlCalendars.addEventListener( 'aa-active', ( evt ) => {
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
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    pnlCalendars.data = calendars;

    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    lstEvents.data = events;  
    calYear.data = events;
    pnlFooter.count = events.length;
  } );
} );

pnlCalendars.addEventListener( 'aa-colors', ( evt ) => {
  if( evt.detail.calendar ) {
    window.localStorage.setItem( 'awesome_colors', true );
    using = true;
  } else {
    window.localStorage.removeItem( 'awesome_colors' );
    using = false;
  }

  for( let c = 0; c < calendars.length; c++ ) {
    colors[calendars[c].id] = calendars[c].color;
  }

  db.event.where( 'startsAt' ).between( starts, ends ).toArray()
  .then( ( data ) => {
    if( using ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    lstEvents.data = events;
    calYear.colored = using;
    calYear.data = events;
    pnlFooter.count = events.length;
  } );
} );

pnlCalendars.addEventListener( 'aa-info', ( evt ) => {
  db.calendar.get( evt.detail.id )
  .then( ( data ) => {
    frmCalendar.data = data;
    // frmCalendar.canDelete = calendars.length > 1 ? true : false;
    blocker( true );
    dlgCalendar.showModal();
    frmCalendar.focus();
  } );
} );

// Calendar
calYear.addEventListener( 'aa-change', ( evt ) => {
  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    lstEvents.selectedItem = event.id;
    pnlEvent.calendars = calendars;
    pnlEvent.data = event;
    dlgEvent.classList.remove( 'transparent' );
    stkEvent.selectedIndex = 1;
    blocker( true );
    dlgEvent.showModal();
  } );
} );

/*
// Setup
*/

pnlCalendars.useCalendar = using;
calYear.colored = using;

if( lefty !== null ) {
  pnlLeft.hidden = false;
  stkLeft.selectedIndex = lefty;
  btnHeaderCalendars.checked = lefty === 0 ? true : false;
  btnHeaderList.checked = lefty === 0 ? false : true;
}

db.calendar.toCollection().sortBy( 'name' )
.then( async ( data ) => {
  if( data.length === 0 ) {
    const id = self.crypto.randomUUID();
    const now = Date.now();
    await db.calendar.put( {
      id: id,
      createdAt: new Date( now ),
      updatedAt: new Date( now ),
      name: 'Calendar',
      color: '#1badf8',
      isShared: false,
      isPublic: false,
      isActive: true
    } );
    colors[id] = '#1badf8';    
    data = await db.calendar.toArray();
  }

  store.calendars.set( [... data] );
  pnlCalendars.data = calendars;

  colors = calendars.reduce( ( prev, curr ) => {
    prev[curr.id] = curr.color;
    return prev;
  }, {} );  

  return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
} )
.then( ( data ) => {
  if( using ) {
    for( let d = 0; d < data.length; d++ ) {
      data[d].color = colors[data[d].calendarId];
    }
  }

  const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
  events = data.filter( ( value ) => active.includes( value.calendarId ) );

  lstEvents.data = events;  
  calYear.data = events;
  pnlFooter.count = events.length;
} );

/*
// Utility
*/

function blocker( disabled = true ) {
  btnHeaderAccount.disabled = disabled;
  btnHeaderCalendars.disabled = disabled;  
  btnHeaderList.disabled = disabled;  
  btnHeaderAdd.disabled = disabled;  
  btnHeaderPrevious.disabled = disabled;  
  btnHeaderNext.disabled = disabled;  
  txtHeaderSearch.disabled = disabled;
  btnHeaderToday.disabled = disabled;
  pnlFooter.disabled = disabled;
  pnlCalendars.disabled = disabled;  
}
