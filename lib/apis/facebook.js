var util = require('util'),
    base = require('./base');

var fbapi = require("facebook-chat-api"),
    Message = require('../schemas/message');

var FacebookAPI = module.exports = function (apiSettings) {
    base.call(this);
    var that = this;

    this.name = 'FACEBOOK';


    var format_message = function(message){
        console.log(message);
        return new Message({
            from: message.from,
            subject: message.subject,
            body: message.body,
            date: message.date
        });
    };

    this.test = function (server, callback) {
        return fbapi(server, callback);
    };

    this.connect = function () {
        var that = this;
        this.test(apiSettings, function (err, api) {
            if (err) {
                that.emitters.connectionProblem(err);
                return;
            }
            that.emitters.connected('facebook connected ');
            api.listen(function (err, message) {
                that.emitters.onMessage(format_message(message));
            });
        });
    }
};
util.inherits(FacebookAPI, base);
