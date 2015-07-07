
var Message = module.exports = function (message) {
    var that = this;
    this.from = 'Senders ID';
    this.to = 'Recipient ID';
    this.subject = '';
    this.body = 'Message body';
    this.date = new Date();


    function format(msg){
        for(var x in msg){
            if(msg.hasOwnProperty(x)){
                that[x] = msg[x];
            }
        }
    }
    if(typeof message !== 'undefined'){
        format(message);
    }
};

