# funnel
Unify messaging platform into one single API

## Application uses 3rd party modules

* [node-imap](https://github.com/mscdex/node-imap)
* [node-mail](https://github.com/weaver/node-mail)
* [node-irc](https://github.com/martynsmith/node-irc)
* [node-whatsupapi](https://github.com/hidespb/node-whatsapi)
* [node-config](https://github.com/lorenwest/node-config)
* [node-redis](https://github.com/mranney/node_redis)

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
            type: 'facebook',
            enabled: false,
            name: 'Fejsbucik',
            settings: {
                email: 'mail@gmail.com`',
                password: 'password'
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

