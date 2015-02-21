var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var DbInitializer = require('./db/dbInitializer');
var user = require('./routes/user');
var category = require('./routes/category');
var product = require('./routes/product');
var offer = require('./routes/offer');
var offerHistory = require('./routes/offerHistory');
var comment = require('./routes/comment');

/*var seaport = require('seaport');
var ports = seaport.connect('192.168.0.150', 9090);
app.set('port', ports.register('app') || 3000);*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/users', user.createUser);
app.get('/users/:userId', user.getUserById)

// Category
app.get('/category', category.getAllCategories);
app.post('/category', category.createCategory);
app.get('/category/:categoryId', category.getCategoryById);

// Product
app.get('/category/:categoryId/product', product.getProductsByCategoryId);
app.post('/category/:categoryId/product', product.createProduct);

app.get('/category/:categoryId/product/:productId', product.getProductByProductId);
app.put('/category/:categoryId/product/:productId', product.updateProduct);
app.delete('/category/:categoryId/product/:productId', product.deleteProduct);

// Offer
app.get('/category/:categoryId/product/:productId/offer', offer.getOffersByProductId);
app.post('/category/:categoryId/product/:productId/offer', offer.createOffer);

app.get('/category/:categoryId/product/:productId/offer/:offerId', offer.getOfferByOfferId);
app.put('/category/:categoryId/product/:productId/offer/:offerId', offer.updateOffer);
app.delete('/category/:categoryId/product/:productId/offer/:offerId', offer.deleteOffer);

// History
app.get('/category/:categoryId/product/:productId/offer/:offerId/history', offerHistory.getOfferHistoryByOfferId);

// Comment
app.post('/category/:categoryId/product/:productId/offer/:offerId/comment', comment.createComment);
app.put('/category/:categoryId/product/:productId/offer/:offerId/comment/:commentId', comment.updateComment);
app.delete('/category/:categoryId/product/:productId/offer/:offerId/comment/:commentId', comment.deleteComment);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	
	DbInitializer.initializeDb(function() {
		console.log("Db initialized");
	});
});
