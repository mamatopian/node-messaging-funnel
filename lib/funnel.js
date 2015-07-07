var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _connector = require('./connector');


var Funnel = module.exports = function(connections){
    var that = this;
    EventEmitter.call(this);

    this.connect = function() {
        var connector = new _connector(connections);
        connector.connect();
        connector.on('message', function(message){
            that.emit('message', message);
        });
        connector.on('auth', function(message){
            console.log('auth', message);
        });
        connector.on('sent', function(message){
            console.log('sent', message);
        });
        connector.on('closed', function(message){
            console.log('closed', message);
        });
    };
    this.send_message = function(connection, to, message){
        connection.send_message(to, message);
    }
};
util.inherits(Funnel, EventEmitter);

