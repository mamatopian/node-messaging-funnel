var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    hash = require('object-hash'),
    api = {
        imap: require('./apis/imap'),
        'google-talk': require('./apis/google-talk'),
        facebook: require('./apis/facebook')
    };


var Connector = module.exports = function (userdata) {
    EventEmitter.call(this);
    var that = this;

    this.connect = function (connection) {
        for (var x = 0; x < userdata.connections.length; x++) {
            var con = userdata.connections[x];
            con.connection = new api[con.type];
            con.connection.on('connected', function (status) {
                console.log(status);
            });
            con.connection.on('connection-problem', function (err) {
                console.log(err);
            });
            con.connection.on('message', function (message) {
                that.emit('message', message);
            });
            con.connection.on('auth', function (message) {
                that.emit('auth', message);
            });
            con.connection.on('closed', function (message) {
                that.emit('closed', message);
            });
            con.connection.connect({
                type: con.type,
                settings: con.settings
            });
        }
    };
};
util.inherits(Connector, EventEmitter);

