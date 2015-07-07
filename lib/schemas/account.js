var EventEmitter = require('events').EventEmitter,
    util = require('util');
var api = {
        mail: require('../apis/imap'),
        'google-talk': require('../apis/google-talk'),
        facebook: require('../apis/facebook')
    };

var Account = module.exports = function (account) {
    var that = this;
    this.type = 'API name';
    this.name = 'Default account';
    this.settings = {};
    this.enabled = false;
    this.connection = {};

    function format(msg){
        for(var x in msg){
            if(msg.hasOwnProperty(x)){
                that[x] = msg[x];
            }
        }
    }
    if(typeof account !== 'undefined'){
        format(account);
    }

    this.isEnabled = function(){
        return this.enabled;
    };
    this.enable = function(e){
        this.enabled = true;
    };
    this.disable = function(e){
        this.enabled = false;
    };

    this.setupConnection = function(callback){
        that.connection = new api[account.type](account.settings);

        that.connection.on('connected', function (status) {
            that.emit('connected', {
                account: this,
                message: status
            });
        });
        that.connection.on('connection-problem', function (err) {
            that.emit('connection-problem', {
                account: this,
                message: err
            });
        });
        that.connection.on('message', function (message) {
            that.emit('message', {
                account: this,
                message: message
            });
        });
        that.connection.on('auth', function (message) {
            that.emit('auth', {
                account: this,
                message: message
            });
        });
        that.connection.on('closed', function (message) {
            that.emit('closed', {
                account: this,
                message: message
            });
        });
        that.connection.on('sent', function (message) {
            that.emit('sent', {
                account: this,
                message: message
            });
        });
        that.connection.on('error', function (message) {
            that.emit('error', {
                account: this,
                message: message
            });
        });
        return that.connection;
    };
    this.connect = function(){
        if(this.isEnabled())
            that.connection.connect();
    }

    this.sendMessage = function(to, message){
        this.connection.sendMessage(to, message);
    }
};
util.inherits(Account, EventEmitter);

