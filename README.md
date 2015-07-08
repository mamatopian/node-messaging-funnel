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

