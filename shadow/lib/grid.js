$( document ).ready( function( ) {
  var column_index = 0;
  $( '#timesheet-events .daysheet-container' ).each( function() {

    var block_width = $(this).width();
    var columns = [];
    var lastEventEnding = null;

    // Create an array of all events
    var events = $('.bubble_selector', this).map(function(index, o) {
      o = $(o);
      var top = o.offset().top;
      return {
        'obj': o,
        'top': top,
        'bottom': top + o.height()
      };
    }).get();

    // Sort it by starting time, and then by ending time.
    events = events.sort(function(e1,e2) {
      if (e1.top < e2.top) return -1;
      if (e1.top > e2.top) return 1;
      if (e1.bottom < e2.bottom) return -1;
      if (e1.bottom > e2.bottom) return 1;
      return 0;
    });

    // Iterate over the sorted array
    $(events).each(function(index, e) {

      if (lastEventEnding !== null && e.top >= lastEventEnding) {
        PackEvents( columns, block_width );
        columns = [];
        lastEventEnding = null;
      }

      var placed = false;
      for (var i = 0; i < columns.length; i++) {                   
        var col = columns[ i ];
        if (!collidesWith( col[col.length-1], e ) ) {
          col.push(e);
          placed = true;
          break;
        }
      }

      if (!placed) {
        columns.push([e]);
      }

      if (lastEventEnding === null || e.bottom > lastEventEnding) {
        lastEventEnding = e.bottom;
      }
    });

    if (columns.length > 0) {
      PackEvents( columns, block_width );
    }
  });
});

function PackEvents( columns, block_width )
{
  var n = columns.length;
  for (var i = 0; i < n; i++) {
    var col = columns[ i ];
    for (var j = 0; j < col.length; j++)
    {
      var bubble = col[j];
      bubble.obj.css( 'left', (i / n)*100 + '%' );
      bubble.obj.css( 'width', block_width/n - 1 );
    }
  }
}

function collidesWith( a, b )
{
  return a.bottom > b.top && a.top < b.bottom;
}
