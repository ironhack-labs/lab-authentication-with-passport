var should = require('should'),
		connect = require('connect'),
		request = require('supertest');

var session = require('../lib/session'),
    header = require('../lib/loader').header;


function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

var app = connect()
	.use(session([header()], {
		maxAge: 1000
	}))
	.use(function(req, res){
		if(req.url === '/get') {
			res.end(req.session.property);
		} else {
			req.session.property = 'Some value';
			res.end(req.sessionID);
		}
    
  });

describe('session - max age', function() {
	it('should not find session if it is expired', function(done) {

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

		    		sleep(1100);

		    		request(app)
		    			.get('/get')
		    			.set('X-User-Session', sid)
		    			.expect(200, function(err, res) {
		    				if(err) return done(err);

		    				res.text.should.not.be.eql(sid);
		    				done()
		    			});
		    	});
      });
    
	});
});