var xmpp = require('node-xmpp-client'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');

var jid = require('xmpp-jid');

var GoogleTalkAPI = module.exports = function () {
    var that = this;
    base.call(this);

    this.send_message = function (to_jid, message_body) {
        var elem = new xmpp.Stanza.Element('message', {to: to_jid, type: 'chat'})
            .c('body').t(message_body);
        that.connection.send(elem);
        util.log('[message] SENT: ' + elem.up().toString());
    };


    this.request_google_roster = function () {
        var roster_elem = new xmpp.Stanza.Element('iq', {from: this.connection.jid, type: 'get', id: 'google-roster'})
            .c('query', {xmlns: 'jabber:iq:roster', 'xmlns:gr': 'google:roster', 'gr:ext': '2'});
        that.connection.send(roster_elem);
    };

    this.test = function (server, callback) {
        var connection = new xmpp(server);

        connection.on('online', function (id, socket) {
            that.request_google_roster();
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
                that.emitters.connectionProblem(stanza);
            } else if (stanza.is('message')) {

                var message = that.processMessage(stanza);
                that.send_message(message.from, message.body); //echo bot
                that.emitters.onMessage(message);

            } else if (stanza.is('presence')
                && stanza.attrs.type === 'subscribe') {
                var subscribe_elem = new xmpp.Element('presence', {
                    to: stanza.attrs.from,
                    type: 'subscribed'
                });
                this.connection.send(subscribe_elem);
            }
        });
        var conn = connection.connect();
        return connection;
    };

    this.processMessage = function (stanza) {
        return {
            from: stanza.attrs.from,
            body: stanza.getChildText('body')
        };
    };


    this.setStatus = function (status_message) {
        var presence_elem = new xmpp.Stanza.Element('presence', {})
            .c('show').t('chat').up()
            .c('status').t(status_message);
        this.connection.send(presence_elem);
    };

    this.connect = function (usersServer, callback) {
        var user = usersServer.user;
        var server = usersServer.settings;

        this.connection = this.test(server, function (status) {

        });

    }
};
util.inherits(GoogleTalkAPI, base);
