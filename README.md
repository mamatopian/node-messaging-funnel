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

var f = new funnel({
    user: {id: 1},
    connections: [{
        type: 'imap',
        settings: {
            user: 'user@server.com',
            password: 'password',
            host: 'host',
            port: 993,
            tls: true
        }
    },{
        type:'xmpp',
        settings:{
            jid: '100007150818147@chat.facebook.com',
            password: 'password',
            port: 5222,
            //legacySSL: false
        }
    },{
        type:'xmpp',
        settings:{
            jid: 'user@gmail.com',
            host: 'talk.google.com',
            password: 'password',
            port: 5223
        }
    }]
});
f.connect();
```
## API

