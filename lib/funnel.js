var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _connector = require('./connector');


var Funnel = module.exports = function(userdata){
    EventEmitter.call(this);

    this.connect = function() {
        var connector = new _connector(userdata);
        connector.connect();
        connector.on('message', function(message){
            console.log(message);
        });
        connector.on('auth', function(message){
            console.log('auth', message);
        });
        connector.on('closed', function(message){
            console.log('closed', message);
        });
    }
};
util.inherits(Funnel, EventEmitter);

