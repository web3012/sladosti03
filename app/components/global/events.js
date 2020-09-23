const EventEmitter = require('events').EventEmitter
const events = new EventEmitter()
events.setMaxListeners(10) 
export {events}