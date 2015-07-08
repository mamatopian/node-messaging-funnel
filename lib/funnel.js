var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    User = require('./schemas/user'),
    Account = require('./schemas/account');


var Funnel = module.exports = function (users) {
    var that = this;
    this._users = [];
    this.users = [];
    // keymap
    this.user_map = {};

    /**
     * Users have structure like:
     *
     [{
             user: {id: 1, name: 'Mato'},   //user's object
             accounts: [{
                    type: 'mail',
                    settings: {specific settings of module},
                    connection: {connection object}
             },...],
       },...]
     */

    EventEmitter.call(this);

    /**
     * Init
     */
    this.init = function () {
        if (typeof users === 'undefined' || users.length == 0) return;
        for (var x = 0; x < users.length; x++) {
            that.addUser(users[x]);
        }
    };

    /**
     * Add new user
     * @param user
     */
    this.addUser = function (user) {
        this._users.push(user);
        var u = new User(user);
        var l = this.users.push(u);
        this.user_map[user.user.id] = l - 1;

        /**
         * Message structure:
         *  {
             *      user: {instance of User},
             *      account: {instance of Account},
             *      message: {instance of Message}
             *  }
         */
        u.on('message', function (message) {
            that.emit('message', message);
        });
        u.on('sent', function (message) {
            that.emit('sent', message);
        });
        u.on('error', function (message) {
            that.emit('error', message);
        });
        u.on('connected', function (message) {
            that.emit('connected', message);
        });
        u.setupAccounts();
    };

    /**
     * Remove user
     * @param user_id
     * @returns {boolean}
     */
    this.removeUser = function (user_id) {
        if (typeof this.users[this.user_map[user_id]] === 'undefined')
            return false;
        this.users[this.user_map[user_id]].removeAllAccounts();
        delete this.users[this.user_map[user_id]];
        delete this._users[this.user_map[user_id]];
        delete this.user_map[user_id];
        return true;
    };

    /**
     * Connect to all users and all their accounts
     */
    this.connectAllUsers = function () {
        if (this.users.length == 0) return;
        for (var x = 0; x < this.users.length; x++) {
            this.connectAllAccounts(this.users[x].user.id);
        }
    };

    /**
     * Connect users accounts
     * @param user_id
     * @returns {boolean}
     */
    this.connectAllAccounts = function (user_id) {
        if (typeof this.user_map[user_id] === 'undefined')
            return false;
        this.users[this.user_map[user_id]].connectAllAccounts();
        return true;
    };

    /**
     * Connect to specific account of specific user
     * @param user_id
     * @param account_id
     * @returns {boolean}
     */
    this.connectAccount = function(user_id, account_id){
        if (typeof this.user_map[user_id] === 'undefined')
            return false;
        return this.users[this.user_map[user_id]].connect(account_id);
    }

    /**
     * Test new connections
     * @param settings
     * @param callback
     */
    this.testConnection = function(settings, callback){
        var a = new Account(settings);
        a.testConnection(settings, callback);
    };

    if(typeof users !== 'undefined' && users.length > 0)
    {
        this.init();
    }
};
util.inherits(Funnel, EventEmitter);

