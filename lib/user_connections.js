var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _connector = require('./connector');


/**
 * UserConnections class
 * manage user and connections
 * @type {Function}
 */
var UserConnections = module.exports = function(user){
    EventEmitter.call(this);

    this.user = user.user;
    this.accounts = user.accounts;
    var that = this.connector = this;

    this.connect = function() {
        var connector = new _connector(user.accounts);
        connector.connect();
        connector.on('message', function(message){
            that.emit('message', {
                user: that,
                receiver: message.receiver,
                message: message.message
            });
        });
        connector.on('auth', function(message){
            console.log('auth', {
                user: that,
                receiver: message.receiver,
                message: message.message
            });
        });
        connector.on('sent', function(message){
            console.log('sent', {
                user: that,
                receiver: message.receiver,
                message: message.message
            });
        });
        connector.on('closed', function(message){
            console.log('closed', {
                user: that,
                receiver: message.receiver,
                message: message.message
            });
        });
    };
};
util.inherits(UserConnections, EventEmitter);