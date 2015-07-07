var util = require('util'),
    EventEmitter = require('events').EventEmitter;
/**
 * Base API schema
 * @type {Function}
 *
 * events:
 *  - connected () - on succesful connection
 *  - connection-problem (status) - on connection problem, status = message
 *
 */
var Base = module.exports = function(){
    EventEmitter.call(this);
    var that = this;
    this.name = 'Base API interface (API name undefined)';
    this.connect = function(){ console.log('Method not implemented (connect)'); };
    this.test = function(){ console.log('Method not implemented (test)'); };
    this.send = function(){ console.log('Method not implemented (send)'); };
    this.disconnect = function(){ console.log('Method not implemented (disconnect)'); };
    this.getContacts = function(){ console.log('Method not implemented (get contacts)'); };
    this.format_message = function(message){ console.log('Method not implemented (format message)'); return message;};

    this.emitters = {
        authProblem: function(message){ that.emit('auth', message);},
        closed: function(){ that.emit('closed');},
        online: function(){ that.emit('online');},
        sent: function(message){ that.emit('sent',message);},
        onMessage: function(message){ that.emit('message', message);},
        connected : function(stat){ that.emit('connected', stat); },
        connectionProblem : function(err){ that.emit('connection-problem', err); },
        error : function(err){ that.emit('error', err); }
    };
};
util.inherits(Base, EventEmitter);