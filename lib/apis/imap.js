var Imap = require('imap'),
    mail = require('nodemailer'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');


var ImapAPI = module.exports = function () {
    base.call(this);
    var that = this;


    this.receive_mail = function (imap, callback) {
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

    this.connect = function (usersServer, callback) {
        var server = usersServer.settings;
        var connection = this.test(server, function (imap) {
            that.connection = {
                server: server,
                connection: connection
            };
            imap.on('mail', function (no) {
                that.receive_mail(imap, function (message) {
                    that.emitters.onMessage(message);
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

    this.send_message = function (to, message) {
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


