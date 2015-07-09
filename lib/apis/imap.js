var Imap = require('imap'),
    mail = require('nodemailer'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base'),
    Message = require('../schemas/message'),
    Account = require('../schemas/account'),
    fs = require('fs');;

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
    this.connection = {};
    this.bodies = {
        full:   ['HEADER.FIELDS (FROM DATE SUBJECT)', 'TEXT'],
        headers: ['HEADER.FIELDS (FROM DATE SUBJECT)'],
        empty: ''
    };

    this.name = 'IMAP';

    var format_message = function(message){
        return new Message({
            from: message.from,
            subject: message.subject,
            body: message.body,
            date: message.date
        });
    };

    var download_mail = function(messageHandler, callback){
        var buffer = '', count = 0;
        var message = {};
        messageHandler.on('body', function (stream, info) {
            stream.on('data', function (chunk) {
                count += chunk.length;
                buffer += chunk.toString('utf8');
            });
            stream.once('end', function () {
            });
        });
        messageHandler.once('attributes', function (attrs) {
            message.date = attrs.date;
            message.uid = attrs.uid;
        });
        messageHandler.once('end', function () {
            var header = Imap.parseHeader(buffer);
            message.from = header.from;
            message.subject = header.subject;
            message.body = buffer;
            callback(message);
        });
    };

    var receive_mail = function (imap, bodies, callback) {
        imap.openBox('INBOX', true, function (err, box) {
            if (err) that.emitters.error(err);
            var f = imap.seq.fetch(box.messages.total + ':*', {bodies: bodies});
            f.on('message', function (msg, seqno) {
                download_mail(msg, callback);
            });
        });
    };

    this.test = function (server, callback) {
        var imap = new Imap(server);
        imap.once('ready', function () {
            imap.openBox('INBOX', true, function (err, box) {
                callback(err, imap);
            });
        });
        imap.connect();
        return imap;
    };

    this.connect = function (callback) {
        var connection = this.test(apiSettings, function (err, imap) {
            that.imap = imap;
            that.connection = {
                server: apiSettings,
                connection: that.imap
            };
            imap.on('mail', function (no) {
                receive_mail(imap, that.bodies.full, function (message) {
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
            that.emitters.connected('imap connected');
        });
    };

    this.readTemplate = function(to, message, callback){
        if(typeof apiSettings.template === 'undefined') return;
        var file = __dirname +'/../'+apiSettings.template;
        console.log(file,__dirname);
        fs.exists(file, function (exists) {
            if(exists){
                fs.readFile(file, function (err, data) {
                    if (err) callback(err, message);
                    data = data.toString();
                    data = data.replace('{from}', apiSettings.smtp.sender);
                    data = data.replace('{to}', to);
                    data = data.replace('{body}', message);
                    callback(null, data);
                });
            }else{
                callback( 'File not exists', message);
            }
        });
    };

    this.sendMessage = function (to, message) {
        var transporter = mail.createTransport(apiSettings.smtp);
        this.readTemplate(to, message, function(err, msg){
            console.log(err);
            var mailOptions = {
                from: apiSettings.smtp.sender,
                to: to,
                subject: 'Message from backoffice',
                //text: message,
                html: msg
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    that.emitters.error(error);
                    return console.log(error);
                }
                that.emitters.sent(info.response);
            });
        });
    };

    this.search = function(query, callback){
        that.imap.search(query, function(err, uids){
            var f = that.imap.fetch(uids, {
                bodies: that.bodies.full
            });
            f.on('message', function(msg, seqno){
                download_mail(msg, function (message) {
                    message.seqno = seqno;
                    that.emitters.onMessage(format_message(message));
                    callback(err, message);
                });
            });
        });
    };

    this.getAllMessagesFromSender = function(address, callback){
        this.search([['FROM', address]], callback);
    };


};
util.inherits(ImapAPI, base);


