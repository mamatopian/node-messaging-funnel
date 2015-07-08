var Imap = require('imap'),
    mail = require('nodemailer'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base'),
    Message = require('../schemas/message'),
    Account = require('../schemas/account');

/**
 * IMAP api implementation
 * @type {Function}
 *
 * public:
 *  connect(callback)
 *  test(server, callback)
 *  sendMessage(to, message)
 *
 * private:
 *  format_message(message
 */
var ImapAPI = module.exports = function (apiSettings) {
    base.call(this);
    var that = this;

    this.name = 'IMAP';

    var format_message = function(message){
        return new Message({
            from: message.from,
            subject: message.subject,
            body: message.body,
            date: message.date
        });
    };

    var receive_mail = function (imap, callback) {
        imap.openBox('INBOX', true, function (err, box) {
            if (err) that.emitters.error(err);

            var buffer = '', count = 0;
            var f = imap.seq.fetch(box.messages.total + ':*', {bodies: ['HEADER.FIELDS (FROM DATE SUBJECT)', 'TEXT']});
            f.on('message', function (msg, seqno) {
                var message = {
                    seqno: seqno
                };
                msg.on('body', function (stream, info) {
                    stream.on('data', function (chunk) {
                        count += chunk.length;
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', function () {
                    });
                });
                msg.once('attributes', function (attrs) {
                    message.date = attrs.date;
                    message.uid = attrs.uid;
                });
                msg.once('end', function () {
                    var header = Imap.parseHeader(buffer);
                    message.from = header.from;
                    message.subject = header.subject;
                    message.body = buffer;
                    callback(message);
                });
            });
        });
    };

    this.test = function (server, callback) {
        var imap = new Imap(server);
        imap.once('ready', function () {
            that.emitters.connected('imap connected');

            imap.openBox('INBOX', true, function (err, box) {
            });
            callback(imap);
        });
        imap.connect();
        return imap;
    };

    this.connect = function (callback) {
        var connection = this.test(apiSettings, function (imap) {
            that.connection = {
                server: apiSettings,
                connection: connection
            };
            imap.on('mail', function (no) {
                receive_mail(imap, function (message) {
                    that.emitters.onMessage(format_message(message));
                });
            });
            imap.once('error', function (err) {
                that.emitters.connectionProblem(err);
            });
            imap.on('alert', function (alert) {
                that.emitters.connectionProblem(alert);
            });
            imap.on('close', function (alert) {
                that.emitters.connectionProblem(alert);
            });
        });
    };

    this.sendMessage = function (to, message) {
        var transporter = mail.createTransport(this.connection.server.smtp);

        var mailOptions = {
            from: this.connection.server.smtp.sender,
            to: to,
            subject: 'Message from backoffice',
            text: message,
            //html: message
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                that.emitters.error(error);
                return console.log(error);
            }
            that.emitters.sent(info.response);
        });
    }
};
util.inherits(ImapAPI, base);


