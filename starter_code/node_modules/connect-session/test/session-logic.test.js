var should = require('should'),
		connect = require('connect'),
		request = require('supertest');

var sessionLoad = require('./config').sessionLoad,
		sessionCreate = require('./config').sessionCreate;

var app = connect()
	.use(sessionLoad)
	.use(function(req, res){
		if(req.url === '/sessions/new') {
			sessionCreate(req, res, function() {
				res.end(req.sessionID);
			});
		} else {
			res.end(req.sessionID);
		}
    
  });

describe('session - logic', function() {
	it('should not create session if no session information in request', function(done) {

		request(app)
			.get('/')
            .expect(200, function(err, res){
      	if (err) return done(err);

        res.text.should.not.be.ok;
        done();
      });
    
	});

	it('should create session on GET /sessions/new', function(done) {
		request(app)
			.get('/sessions/new')
      .expect(200, function(err, res){
      	if (err) return done(err);

        res.text.should.not.be.empty;
        done();
      });
	});

	it('should load newly created session if session information included in request', function(done) {
		var sid = false;

		request(app)
			.get('/sessions/new')
			.expect(200, function(err, res) {
				if (err) return done(err);

				sid = res.text;

				request(app)
					.get('/')
					.set('X-User-Session', sid)
					.expect(200, function(err, res){
						if (err) return done(err);

		        res.text.should.be.eql(sid);
		        done();
		      });
			});
	});
})