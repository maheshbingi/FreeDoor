var assert = require('assert'), http = require('http');

var options = {
	hostname : 'localhost',
	port : 3000
};

describe('Product', function() {
	getProduct(1, 200);
	getProduct(10001, 404);
	createProduct({}, 500);
	deleteProduct(7, 200);
	deleteProduct(7, 404);
});

function getProduct(id, expectedStatusCode) {
	it('Get product', function(done) {
		options.method = 'get';
		options.path = '/category/1/product/' + id;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				// console.log('BODY: ' + chunk);
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

function createProduct(product, expectedStatusCode) {
	it('Create product', function(done) {
		options.method = 'POST';
		options.path = '/category/1/product';
		options.data = product;
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

function deleteProduct(id, expectedStatusCode) {
	it('Delete product', function(done) {
		options.method = 'DELETE';
		options.path = '/category/1/product/' + id;
		console.log(options);

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