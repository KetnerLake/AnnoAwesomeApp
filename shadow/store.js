import Writeable from "./util//writeable.js";

export const store = {
  calendars_open: new Writeable( false ),
  events_open: new Writeable( false ),
  left_open: new Writeable( false ),
  right_open: new Writeable( false ),
  search_value: new Writeable( null ),

  calendars: new Writeable( [] ),
  events: new Writeable( [] ),

  colors: new Writeable( [
    {name: 'Red', value: '#ff2968'},
    {name: 'Orange', value: '#ff9500'},
    {name: 'Yellow', value: '#ffcc02'},
    {name: 'Green', value: '#63da38'},
    {name: 'Blue', value: '#1badf8'},
    {name: 'Purple', value: '#cc73e1'}
  ] )
};
