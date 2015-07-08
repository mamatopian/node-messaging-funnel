var EventEmitter = require('events').EventEmitter,
    util = require('util');
var Account = require('./account');

var User = module.exports = function (user) {
    var that = this;
    this.userObject = {};
    this.accounts = [];
    this._accounts = [];
    this.connector = {};
    this.account_map = {};

    this.getConnector = function(){
        return that.connector;
    };

    /**
     * Get all user accounts
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

    /**
     * Set up all accounts in node and set their events
     */
    this.setupAccounts = function(){
        for (var x = 0; x < this._accounts.length; x++) {
            that.addAccount(this._accounts[x])
        }
    };

    /**
     * Connect to all accounts
     */
    this.connectAllAccounts = function(){
        for (var x = 0; x < this.accounts.length; x++) {
            this.connect(this.accounts[x].id);
        }
    };

    /**
     * Connect to account with specified ID
     * @param account_id
     * @returns {boolean}
     */
    this.connect = function(account_id){
        if(!this.isAccount(account_id))
            return false;
        return this.accounts[ this.account_map[account_id]].connect();
    };

    /**
     * Add new account
     * @param account
     * @param callback
     * @returns {Account}
     */
    this.addAccount = function(account, callback){
        var con = new Account( account );
        var l = this.accounts.push(con);
        this.account_map[account.id] = l-1;

        con.on('message', function(message){
            that.emit('message', {
                user: that,
                account: message.account,
                message: message.message
            });
        });
        con.on('connected', function(message){
            that.emit('connected', {
                user: that,
                account: message.account,
                message: message.message
            });
        });
        con.on('auth', function(message){
            that.emit('auth', {
                user: that,
                account: message.account,
                message: message.message
            });
        });
        con.on('sent', function(message){
            that.emit('sent', {
                user: that,
                account: message.account,
                message: message.message
            });
        });
        con.on('closed', function(message){
            that.emit('closed', {
                user: that,
                account: message.account,
                message: message.message
            });
        });

        if(con.isEnabled())
            con.setupConnection();

        return con;
    };

    /**
     * Remove account
     * @param account_id
     * @returns {boolean}
     */
    this.removeAccount = function(account_id){
        if(!this.isAccount(account_id))
            return false;
        var deleted = false;
        for(var x = 0; x < this.accounts.length; x++){
            if(this.accounts[x].id == account_id){
                this.accounts.splice(x, 1);
                this._accounts.splice(x, 1);
                delete this.account_map[account_id];
                deleted = true;
            }
        }
        return deleted;
    };

    /**
     * Remove all users accounts
     * @returns {boolean}
     */
    this.removeAllAccounts = function(){
        var accounts = this.getAccounts(false);
        for(var x = 0; x < accounts.lengt(); x ++){
            this.removeAccount(accounts[x].id);
        }
    };

    /**
     * Get account by it's ID
     * @param account_id
     * @returns {*}
     */
    this.getAccountByID = function(account_id){
        return this.accounts[ this.account_map[account_id]];
    };

    /**
     * Account exists?
     * @param account_id
     * @returns {boolean}
     */
    this.isAccount = function(account_id){
        return !(typeof this.account_map[account_id] === 'undefined' ||
            typeof this.accounts[ this.account_map[account_id]] === 'undefined');
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

