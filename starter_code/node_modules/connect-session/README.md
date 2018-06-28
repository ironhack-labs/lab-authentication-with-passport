# connect-session

It is a small project which help organize optional sessions in REST applications that uses connect/express. By default
 connect has only cookie session, that is not applicable and very unconvinient for API projects.

## Usage

Generally it based on connect session.js code, so configuration and options almost the same.

For example you have a route that handle session management:

First i expect you will made some configuration and create middleware function:

```javascript
//you config-session.js file
var connectSession = require('connect-session'),
    session = connectSession.session,
    header = connectSession.header;


var util = require('../lib/utils');

//you should replace this one with other store (but this used by default)
var MemoryStore = require('../lib/session/memory');

var loaders = [
    header({
        header: 'X-User-Session' //this used by default, so you can skip this
    })
];

var options = {
    store: new MemoryStore
}

module.exports.sessionCreate = session(loaders, options);

module.exports.sessionLoad = session(loaders, util.merge(options, {
    generateOnMissingSID: false
}));
```

```javascript

var sessionCreate = require('./config-session').sessionCreate;

app.get('/sessions/new', sessionCreate, function(req, res) {
    res.json({ sid: req.sessionID});
})
```

This route will return newly created session and initialize session. You should understand that session will be available
<b>only in this route</b>. What happen there:

First request will be processed by session middleware (by default it uses `MemoryStore` to store sessions) it will use
header loader to try to find session id in default header `'X-User-Session'` (to change this pass in header options { header: 'My-header'}).
If session id will not be founded new session will be created and its sid will be returned.

Of course you expect that session will be loaded every time it can be loaded, to make this need to add in app general middleware:

```javascript
var sessionLoad = require('./config-session').sessionLoad;

//do not forget add all needed middleware before!!!
app.use(sessionLoad);
```