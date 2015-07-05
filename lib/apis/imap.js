var Imap = require('imap'),
    inspect = require('util').inspect,
    util = require('util'),
    base = require('./base');


var ImapAPI = module.exports = function () {
    base.call(this);
    var that = this;

    this.test = function (server, callback) {
        var testConnection = new Imap(server);
        testConnection.once('ready', function () {
            that.emitters.connected('imap connected');
        });
        testConnection.once('error', function (err) {
            that.emitters.connectionProblem(err);
        });
        testConnection.on('alert', function (alert) {
            that.emitters.connectionProblem(alert);
        });
        testConnection.on('close', function (alert) {
            that.emitters.connectionProblem(alert);
        });
        testConnection.connect();
        return testConnection;
    };

    this.connect = function (usersServer, callback) {
        var user = usersServer.user;
        var server = usersServer.settings;
        var connection = this.test(server, function (status) {
            this.connection = {
                server: server,
                connection: connection
            };
        });
    }
};
util.inherits(ImapAPI, base);
/*

 var imap = new Imap();

 function openInbox(cb) {
 imap.openBox('INBOX', true, cb);
 }

 imap.once('ready', function() {
 openInbox(function(err, box) {
 if (err) throw err;
 var f = imap.seq.fetch('1:3', {
 bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
 struct: true
 });
 f.on('message', function(msg, seqno) {
 console.log('Message #%d', seqno);
 var prefix = '(#' + seqno + ') ';
 msg.on('body', function(stream, info) {
 var buffer = '';
 stream.on('data', function(chunk) {
 buffer += chunk.toString('utf8');
 });
 stream.once('end', function() {
 console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
 });
 });
 msg.once('attributes', function(attrs) {
 console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
 });
 msg.once('end', function() {
 console.log(prefix + 'Finished');
 });
 });
 f.once('error', function(err) {
 console.log('Fetch error: ' + err);
 });
 f.once('end', function() {
 console.log('Done fetching all messages!');
 imap.end();
 });
 });
 });*/
