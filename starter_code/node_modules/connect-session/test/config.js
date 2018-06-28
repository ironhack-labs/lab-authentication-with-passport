/*var connectSession = require('..'),
    session = connectSession.session,
    header = connectSession.header;*/

var session = require('../lib/session'),
    header = require('../lib/loader').header;

var util = require('../lib/utils');

//you should replace this one other store
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