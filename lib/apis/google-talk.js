var xmpp = require('node-xmpp-client'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');

var GoogleTalkAPI = module.exports = function (apiSettings) {
    var that = this;
    base.call(this);


    var format_message = function(message){
        return new Message({
            from: message.from,
            subject: '',
            body: message.body,
            date: new Date()
        });
    };


    this.request_google_roster = function () {
        var roster_elem = new xmpp.Stanza.Element('iq', {from: this.connection.jid, type: 'get', id: 'google-roster'})
            .c('query', {xmlns: 'jabber:iq:roster', 'xmlns:gr': 'google:roster', 'gr:ext': '2'});
        that.connection.send(roster_elem);
    };

    this.test = function (server, callback) {
        var connection = new xmpp(server);

        connection.on('online', function (id, socket) {
            that.emitters.connected('xmpp connected ', id);
            callback(null, connection);
        });
        connection.connect();
        return connection;
    };

    this.processMessage = function (stanza) {
        //console.log(stanza);
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

    this.connect = function (callback) {
        this.connection = this.test(apiSettings, function (err, connection) {
            that.request_google_roster();
            that.setStatus('connected');
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
                that.emitters.onMessage(format_message({from: from, body: message}));
            });
            connection.on('stanza', function (stanza) {
                if ('error' === stanza.attrs.type) {
                    that.emitters.connectionProblem(stanza);
                }
                else if (stanza.is('message')) {
                    var message = that.processMessage(stanza);
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
        });
    };

    this.sendMessage = function (to_jid, message_body) {
        var elem = new xmpp.Stanza.Element('message', {to: to_jid, type: 'chat'})
            .c('body').t(message_body);
        that.connection.send(elem);
        that.emit('sent', {
            to: to_jid, body: message_body
        });
    };
};
util.inherits(GoogleTalkAPI, base);
