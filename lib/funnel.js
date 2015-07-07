var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    userConnector = require('./user_connections');


var Funnel = module.exports = function(users){
    var that = this;
    this.users = users;

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
             connector: {connectorObject}
       },...]
     */

    EventEmitter.call(this);

    this.connect = function() {
        for(var x = 0; x < this.users.length; x ++){
            var c = new userConnector(this.users[x]);

            c.on('message', function (message) {
                console.log(message);
               // message.receiver.send_message(message.message.from, 'hovienko');
            });
            c.on('send', function (message) {
                console.log('message sent');
            });
            c.on('error', function (message) {
                console.log('message sent');
            });
            c.connect();
        }
    };
    this.send_message = function(connection, to, message){
        connection.send_message(to, message);
    }
};
util.inherits(Funnel, EventEmitter);

