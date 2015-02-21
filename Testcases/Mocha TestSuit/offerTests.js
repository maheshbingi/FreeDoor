var assert = require('assert'), http = require('http');

var options = {
	hostname : 'localhost',
	port : 3000
};

describe('Product', function() {
	getOfferByOfferId(1, 1, 1, 200);
	getOfferByOfferId(1, 1, 1001, 404);
	getAllOffersByProductId(1, 1, 200);
	createOffer(1, 1, {}, 500);
});

function getOfferByOfferId(categoryId, productId, offerId, expectedStatusCode) {
	it('Get product', function(done) {
		options.method = 'GET';
		options.path = '/category/' + categoryId + '/product/' + productId + '/offer/' + offerId;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {});
			res.on('end', function() {
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

function getAllOffersByProductId(categoryId, productId, expectedStatusCode) {
	it('Get all products', function(done) {
		options.method = 'GET';
		options.path = '/category/' + categoryId + '/product/' + productId + '/offer';
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
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

function createOffer(categoryId, productId, offer, expectedStatusCode) {
	it('Create product', function(done) {
		options.method = 'POST';
		options.path = '/category/' + categoryId + '/product/' + productId + '/offer';
		options.data = offer;
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
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