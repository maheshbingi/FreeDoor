var assert = require('assert'), http = require('http');

var options = {
	hostname : 'localhost',
	port : 3000
};

describe('User', function() {
	getUser(1, 200);
	getUser(10001, 404);
	createUser({}, 500);
});

function getUser(id, expectedStatusCode) {
	it('Get user', function(done) {
		options.method = 'get';
		options.path = '/users/' + id;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				// console.log('BODY: ' + chunk);
				assert.equal('application/json', res.headers["content-type"]);
				assert.equal(expectedStatusCode, res.statusCode);
				done();
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		req.end();
	});
}

function createUser(user, expectedStatusCode) {
	it('Create user', function(done) {
		options.method = 'POST';
		options.path = '/users';
		options.data = user;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log('BODY: ' + chunk);
				assert.equal('application/json', res.headers["content-type"]);
				assert.equal(expectedStatusCode, res.statusCode);
				done();
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		req.end();
	});
}