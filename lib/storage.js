var Client = require('node-rest-client').Client,
    config = require('config');

var Storage = module.exports = function(settings){
    var client = new Client();
    var apiRoot = config.get('storage.root');


    /**
     * Stora messages on server
     * @param user
     * @param message
     */
    this.save = function(user, message){
        client.post(apiRoot + 'messages/save',{
            user: user,
            message: message
        }, function(data,response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
        })
    }
};