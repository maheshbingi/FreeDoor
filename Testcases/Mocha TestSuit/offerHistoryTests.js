var assert = require('assert'), http = require('http');

var options = {
	hostname : 'localhost',
	port : 3000
};

describe('Offer History', function() {
	getOfferHistoryByOfferId(1, 1, 1, 200);
});

function getOfferHistoryByOfferId(categoryId, productId, offerId, expectedStatusCode) {
	it('Get offer history', function(done) {
		options.method = 'GET';
		
		options.path = '/category/' + categoryId + '/product/' + productId + '/offer/' + offerId + '/history';
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