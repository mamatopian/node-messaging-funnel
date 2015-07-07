var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    hash = require('object-hash'),
    api = {
        mail: require('./apis/imap'),
        'google-talk': require('./apis/google-talk'),
        facebook: require('./apis/facebook')
    };

/**
 * Connector class
 * used for managing connections per user
 * @type {Function}
 */
var Connector = module.exports = function (accounts) {
    EventEmitter.call(this);
    this.connections = accounts;
    var that = this;

    this.connect = function () {
        for (var x = 0; x < accounts.length; x++) {
            var con = this.connections[x];
            if(!con.enabled) continue;
            con.connection = new api[con.type];
            con.connectionID = x;
            con.connection.setID(x);

            con.connection.on('connected', function (status) {
                console.log(status);
            });
            con.connection.on('connection-problem', function (err) {
                console.log(err);
            });
            con.connection.on('message', function (message) {
                that.emit('message', {
                    receiver: this,
                    message: message
                });
            });
            con.connection.on('auth', function (message) {
                that.emit('auth', message);
            });
            con.connection.on('closed', function (message) {
                that.emit('closed', message);
            });
            con.connection.on('sent', function (message) {
                that.emit('sent', message);
            });
            con.connection.on('error', function (message) {
                that.emit('error', message);
            });
            con.connection.connect({
                type: con.type,
                settings: con.settings
            });
        }
    };

    this.send_message = function(connection, to, message){
        connection.send_message(to, message);
    };
};
util.inherits(Connector, EventEmitter);

