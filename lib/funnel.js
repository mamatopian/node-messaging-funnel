var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    User = require('./schemas/user');


var Funnel = module.exports = function(users){
    var that = this;
    this._users = users;
    this.users = [];

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

    this.init = function(){
        this.users = [];
        for(var x = 0; x < this._users.length; x ++){
            var user = this.users[x] = new User(this._users[x]);

            /**
             * Message structure:
             *  {
             *      user: {instance of User},
             *      account: {instance of Account},
             *      message: {instance of Message}
             *  }
             */
            user.on('message', function (message) {
                that.emit('message', message);
            });
            user.on('send', function (message) {
                console.log('message sent');
            });
            user.on('error', function (message) {
                console.log('message sent');
            });
            user.setupAccounts();
        }
    };

    this.connectAllUsers = function() {
        for(var x = 0; x < this.users.length; x ++){
            this.users[x].connectAllAccounts();
        }
    };
    this.send_message = function(connection, to, message){
        connection.send_message(to, message);
    }
};
util.inherits(Funnel, EventEmitter);

