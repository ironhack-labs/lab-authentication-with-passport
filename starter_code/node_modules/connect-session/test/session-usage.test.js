var should = require('should'),
		connect = require('connect'),
		request = require('supertest');

var session = require('../lib/session'),
    header = require('../lib/loader').header;


var app = connect()
	.use(session([header()]))
	.use(function(req, res){
		if(req.url === '/get') {
			res.end(req.session.property);
		} else {
			req.session.property = 'Some value';
			res.end(req.sessionID);
		}
  });

describe('session', function() {
	it('should find sid from header', function(done) {

		var sid = false;

		//first we are getting SID from API call
		request(app)
			.get('/')
      .expect(200, function(err, res){
        if (err) return done(err);
        sid = res.text;

		    request(app)
		    	.get('/')
		    	.set('X-User-Session', sid)
		    	.expect(200, sid, function(err, res) {
		    		if(err) return done(err);

		    		request(app)
		    			.get('/get')
		    			.set('X-User-Session', sid)
		    			.expect(200, 'Some value', done);
		    	});
      });
    
	})
})