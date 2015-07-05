var xmpp = require('simple-xmpp'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');

var jid = require('xmpp-jid');

var XmppAPI = module.exports = function(){
    base.call(this);

    this.test = function(server, callback){
        var testConnection = new xmpp.Client(server);

        testConnection.on('online', function() {
            callback('ready');
        });
        testConnection.on('auth', function() {
            callback('auth');
        });
        testConnection.on('error', function(err) {
            callback(err);
        });
        testConnection.on('stanza', function(stanza) {
            console.log('Incoming stanza: ', stanza.toString())
        });
        testConnection.connect();
        return testConnection;
    };

    this.connect = function(usersServer, callback){
        var that = this;
        var user = usersServer.user;
        var server = usersServer.settings;
        var connection = this.test(server, function(status){
            if(status == 'ready'){
                this.connection = {
                    server: server,
                    connection: connection
                };
                that.emitters.connected('xmpp connected');
            }else{
                that.emitters.connectionProblem(status);
            }
        });

    }
};
util.inherits(XmppAPI, base);
