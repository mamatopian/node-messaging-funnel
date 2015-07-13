# funnel
Unify messaging platform into one single API

## Application uses 3rd party modules

* [node-imap](https://github.com/mscdex/node-imap)
* [nodemailer](https://github.com/andris9/Nodemailer)
* [node-config](https://github.com/lorenwest/node-config)
* [node-redis](https://github.com/mranney/node_redis)
* [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api)
* [node-xmpp-client](https://github.com/node-xmpp/node-xmpp-client)

## Example

```javascript
var funnel = require('./node-messaging-funnel');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var users = [
    {
        user: {id: 1, name: 'Mato'},
        accounts: [{
            id: 123,
            type: 'mail',
            name: 'xxxx@biosdesign.eu',
            enabled: false,
            settings: {
                user: 'xxx@biosdesign.eu'
            }
        }]
    },
    {
        user: {id: 2, name: 'Amir'},
        accounts: [{
            id: 3,
            name: 'mail xxxxx2@biosdesign.eu',
            type: 'mail',
            enabled: true,
            settings: {
                user: 'xxxxx2@biosdesign.eu',
                password: 'pass',
                host: 'imap.server.com',
                port: 993,
                tls: true,
                template: 'assets/mail.html',
                smtp: {
                    host: 'smtp.server.com',
                    port: 465,
                    name: 'xxxxx2@biosdesign.eu',
                    secure: true,
                    ignoreTLS: true,
                    debug: true,
                    sender: 'Name surname <xxxxx2@biosdesign.eu>',
                    auth: {
                        user: 'xxxxx2@biosdesign.eu',
                        pass: 'password'
                    }
                }
            }
        }, {
            id: 4,
            type: 'facebook',
            enabled: false,
            name: 'Fejsbucik',
            settings: {
                email: 'mail@gmail.com`',
                password: 'password'
            }
        }, {
            id: 5,
            type: 'google-talk',
            enabled: true,
            name: 'Google talk',
            settings: {
                "jid": "JID@gmail.com",
                "password": 'password',
                "host": "talk.google.com",
                "port": 5222,
                preferred: "PLAIN",
                reconnect: true

            }
        }]
    }
];
var f = new funnel(users);
f.on('message', function(message){
    console.log(message.user, message.message);
    rl.question("Answer: ", function(answer) {
        message.account.sendMessage(message.message.from, answer);
    });
});
f.init();
f.connectAllUsers();
```
## API

### **Message in event callback object example**

```JSON
{
    "user": {User object},
    "account": {Account object},
    "message": {Message object}
}
```

### **USER object**

```JSON
{
    "accounts": [ {Account}, {Account},...],
    "_accounts": [ {AccountFromSettings},... ]
    "getAccounts": function(unsafe),
    "setupAccounts": function(),
    "connectAllAccounts": function(),
    "connect": function(account_id),
    "addAccount": function(Account, function callback),
    "removeAccount": function(account_id),
    "removeAllAccounts": function(),
    "getAccountByID": function(account_id),
    "isAccount": function(account_id)
}
```

### **ACCOUNT object**

```JSON
{
    "id": {integer},
    "type": 'facebook|google-talk|mail',
    "name": {string},
    "settings": {object},
    "enabled": {boolean},
    "connection": {connection API implementation object}
}
```

### **MESSAGE object**

```JSON
{
    "from": {string},
    "to": {string},
    "subject": {string},
    "body": {string},
    "date": {Date},
}
```

### **Test connection**
```javascript
var f = new funnel();
f.testConnection({
    "type": 'facebook',
    "settings": {
        email: 'cicinbus@gmail.com',
        password: 'password'
    }
}, function(err, connection){
    console.log(err, connection);
});
```

### **Search for messages**
```javascript
var f = new funnel();
f.on('connected', function(message){
    message.account.search(<criteria>, function(err, messages){
        console.log(err,messages);
    });
    console.log('connected');
});
```
* criteria - described in [node-imap documentation](https://github.com/mscdex/node-imap)

### **Get all mails from specific address**
```javascript
var f = new funnel();
f.on('connected', function(message){
    message.account.getAllMessagesFromSender('sender@gmail.com', function(err, messages){
        console.log(err,messages);
    });
    console.log('connected');
});
```