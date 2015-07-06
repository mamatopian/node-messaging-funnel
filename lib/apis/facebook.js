var util = require('util'),
    base = require('./base');

var fbapi = require("facebook-chat-api");

var FacebookAPI = module.exports = function () {
    base.call(this);


    this.test = function (server, callback) {
        return fbapi(server, callback);
    };

    this.connect = function (usersServer, callback) {
        var that = this;
        var server = usersServer.settings;

        var connection = this.test(server, function (err, api) {
            if (err) {
                that.emitters.connectionProblem(err);
                return;
            }
            that.emitters.connected('facebook connected ' + server.email);
            this.connection = {
                server: server,
                connection: api
            };
            api.listen(function callback(err, message) {
                that.emitters.onMessage(server, message);
            });

        });

    }
};
util.inherits(FacebookAPI, base);
