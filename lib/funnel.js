var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _connector = require('./connector');


var Funnel = module.exports = function(userdata){
    EventEmitter.call(this);

    this.connect = function() {
        var connector = new _connector(userdata);
        connector.connect();
    }
};
util.inherits(Funnel, EventEmitter);

