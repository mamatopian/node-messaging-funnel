var xmpp = require('node-xmpp-client'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');

var jid = require('xmpp-jid');

var XmppAPI = module.exports = function () {
    var that = this;
    base.call(this);

    var commands = {};
    //The first function allows you to easily add new functionality to the bot by simply setting up a callback function for a command name.
    function add_command(command, callback) {
        commands[command] = callback;
    }


    this.send_message = function(to_jid, message_body){
        var elem = new xmpp.Element('message', { to: to_jid, type: 'chat' })
            .c('body').t(message_body);
        that.connection.send(elem);
        util.log('[message] SENT: ' + elem.up().toString());
    }


    this.execute_command = function (request) {
        if (typeof commands[request.command] === "function") {
            return commands[request.command](request);
        }
        return false;
    };

    this.test = function (server, callback) {
        var connection = new xmpp(server);

        connection.on('online', function (id, socket) {
            that.setStatus('connected');
            that.emitters.connected('xmpp connected ', id);
        });
        connection.on('auth', function (err) {
            that.emitters.authProblem(err);
        });
        connection.on('error', function (err) {
            that.emitters.connectionProblem(err);
        });
        connection.on('close', function (err) {
            that.emitters.closed(err);
        });
        connection.on('chat', function (from, message) {
            that.emitters.onMessage({from: from, message: message});
        });
        connection.on('stanza', function (stanza) {
            if ('error' === stanza.attrs.type) {
                util.log('[error] ' + stanza.toString());
            } else if (stanza.is('message')) {
                util.log('[message] RECV: ' + stanza.toString());

            } else if (stanza.is('presence')
                && stanza.attrs.type === 'subscribe') {
                var subscribe_elem = new xmpp.Element('presence', {
                    to: stanza.attrs.from,
                    type: 'subscribed'
                });
                conn.send(subscribe_elem);
            }
        });
        var conn = connection.connect();
        return connection;
    };

    this.split_request = function (stanza) {
        var message_body = stanza.getChildText('body');
        if (null !== message_body) {
            message_body = message_body.split(config.command_argument_separator);
            var command = message_body[0].trim().toLowerCase();
            if ('help' === command || '?' == command) {
            } else if (typeof message_body[1] !== "undefined") {
                return {
                    "command": command,
                    "argument": message_body[1].trim(),
                    "stanza": stanza
                };
            }
        }
        return false;
    }

    this.setStatus = function (status_message) {
        var presence_elem = new xmpp.Stanza.Element('presence', {})
            .c('show').t('chat').up()
            .c('status').t(status_message);
        this.connection.send(presence_elem);
    };

    this.connect = function (usersServer, callback) {
        var user = usersServer.user;
        var server = usersServer.settings;

        add_command('s', function(request) {
            this.setStatus(request.argument);
            return true;
        });
        add_command('b', function(request) {
            send_message(request.stanza.attrs.from, request.stanza.getChildText('body'));
            return true;
        });

        this.connection = this.test(server, function (status) {

        });

    }
};
util.inherits(XmppAPI, base);
