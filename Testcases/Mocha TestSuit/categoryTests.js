var assert = require('assert'), http = require('http');
var url = "http://localhost:3000"
var options = {
	hostname : 'localhost',
	port : 3000
};

/**
 * Checks whether API returns array of categories or not
 */
describe('Category', function() {
	getAllCategories();
	getCategory(1, 200);
	getCategory(100, 404);
	deleteCategory(100, 404);
	createCategory({}, 500);
});

/**
 * Checks whether API returns array of categories or not
 */
function getAllCategories() {
	it('Get all categories', function(done) {
		options.method = 'get';
		options.path = '/category';
		var req = http.request(options, function(res) {
			res.on('data', function(chunk) {
				assert.equal('application/json', res.headers["content-type"]);
				assert.equal(200, res.statusCode);
				done();
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		req.end();
	});
}

function getCategory(id, expectedStatusCode) {
	it('Get category', function(done) {
		options.method = 'get';
		options.path = '/category/' + id;
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

function deleteCategory(id, expectedStatusCode) {
	it('Delete category', function(done) {
		options.method = 'delete';
		options.path = '/category/' + id;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log('BODY: ' + chunk);
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

function createCategory(category, expectedStatusCode) {
	it('Create category', function(done) {
		options.method = 'POST';
		options.path = '/category';
		options.data = category;
		console.log(options);
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
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