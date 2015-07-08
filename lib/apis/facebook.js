var util = require('util'),
    base = require('./base');

var fbapi = require("facebook-chat-api"),
    Message = require('../schemas/message');

var FacebookAPI = module.exports = function (apiSettings) {
    base.call(this);
    var that = this;

    this.name = 'FACEBOOK';


    var format_message = function(message){
        //console.log(message);
        return new Message({
            from: message.thread_id,
            //subject: message.type,
            body: message.body,
            date: new Date()
        });
    };

    this.test = function (server, callback) {
        return fbapi(server, callback);
    };

    this.connect = function () {
        var that = this;
        var connection = this.test(apiSettings, function (err, api) {
            if (err) {
                that.emitters.error(err);
                return;
            }
            that.emitters.connected('facebook connected ');
            api.listen(function (err, message) {
                that.emitters.onMessage(format_message(message));
            });
            that.connection = {
                server: apiSettings,
                connection: api
            };
        });
    };

    this.sendMessage = function (to, message) {
        that.connection.connection.sendMessage(message, to);
    }
};
util.inherits(FacebookAPI, base);
