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

    this.connect = function(){ console.log('Method not implemented'); };
    this.test = function(){ console.log('Method not implemented'); };
    this.send = function(){ console.log('Method not implemented'); };
    this.disconnect = function(){ console.log('Method not implemented'); };
    this.getContacts = function(){ console.log('Method not implemented'); };

    this.emitters = {
        authProblem: function(message){ that.emit('auth', message);},
        closed: function(){ that.emit('closed');},
        online: function(){ that.emit('online');},
        onMessage: function(message){ that.emit('message', message);},
        connected : function(stat){ that.emit('connected', stat); },
        connectionProblem : function(err){ that.emit('connection-problem', err); }
    };
};
util.inherits(Base, EventEmitter);