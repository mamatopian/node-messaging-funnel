var EventEmitter = require('events').EventEmitter,
    util = require('util');
var Account = require('./account');

var User = module.exports = function (user) {
    var that = this;
    this.userObject = {};
    this._accounts = {};
    this.connector = {};

    this.getConnector = function(){
        return that.connector;
    };
    /**
     *
     * @param unsafe
     * @returns {*}
     */
    this.getAccounts = function(unsafe){
        if(typeof unsafe !== 'undefined' && unsage == true)
            return this.accounts;
        var accounts = [];
        for(var x = 0; x < this.accounts.length; x ++){
            accounts.push({
                id: x,
                name: this.accounts[x].name
            });
        }
        return accounts;
    };

    this.setupAccounts = function(){
        this.accounts = [];
        for (var x = 0; x < this._accounts.length; x++) {
            var con = this.accounts[x] = new Account( this._accounts[x] );
            if(!con.isEnabled()) continue;

            con.on('message', function(message){
                that.emit('message', {
                    user: that,
                    account: message.account,
                    message: message.message
                });
            });
            con.on('auth', function(message){
                console.log('auth', {
                    user: that,
                    account: message.account,
                    message: message.message
                });
            });
            con.on('sent', function(message){
                console.log('sent', {
                    user: that,
                    account: message.account,
                    message: message.message
                });
            });
            con.on('closed', function(message){
                console.log('closed', {
                    user: that,
                    account: message.account,
                    message: message.message
                });
            });

            con.setupConnection();
        }
    };

    this.connectAllAccounts = function(){
        for (var x = 0; x < this.accounts.length; x++) {
            this.accounts[x].connect();
        }
    };

    function format(u){
        for(var x in u){
            if(u.hasOwnProperty(x)){
                if(x == 'accounts'){
                    that._accounts = u[x];
                    that.setupAccounts();
                }else
                    that[x] = u[x];
            }
        }
    }
    if(typeof user !== 'undefined'){
        format(user);
    }

};
util.inherits(User, EventEmitter);

