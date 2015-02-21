var Validator = require('./validator');
var Constants = require('./constants');
var User = require('./user');
var Category = require('./category');

var Product = function (productId, productName, quantity, userId, expectedOffer, productDesc,
		productExpiryDate, isValid, categoryId) {
	this.productId = productId;
	this.productName = productName;
	this.quantity = quantity;
	this.expectedOffer = expectedOffer;
	this.productDesc = productDesc;
	this.productExpiryDate = productExpiryDate;
	this.isValid = isValid;
	this.user = new User(userId);
	this.category = new Category(categoryId);
}

Product.prototype.createFromRequest = function(req) {
	this.productId = req.param(Constants.PRODUCT_ID, undefined);
	this.productName = req.param(Constants.PRODUCT_NAME, undefined);
	this.quantity = req.param(Constants.QUANTITY, undefined);
	this.user = new User();
	this.user.createFromRequest(req);
	this.expectedOffer = req.param(Constants.EXPECTED_OFFER, undefined);
	this.productDesc = req.param(Constants.PRODUCT_DESC, undefined);
	this.productExpiryDate = req.param(Constants.PRODUCT_EXPIRY_DATE, undefined);
	this.isValid = req.param(Constants.IS_VALID, undefined);
	this.category = new Category();
	this.category.createFromRequest(req);
}

// Product Id
Product.prototype.setProductId = function(productId) {
	this.productId = productId;
}

Product.prototype.getProductId = function() {
    return this.productId;
}

// Product Name
Product.prototype.setProductName = function(productName) {
	this.productName = productName;
}

Product.prototype.getproductName = function() {
    return this.productName;
}

// Quantity
Product.prototype.setQuantity = function(quantity) {
	this.quantity = quantity;
}

Product.prototype.getQuantity = function() {
    return this.quantity;
}

// User Id
Product.prototype.setUser = function(user) {
	this.user = user;
}

Product.prototype.getUser = function() {
    return this.user;
}

// Expected offer
Product.prototype.setExpectedOffer = function(expectedOffer) {
	this.expectedOffer = expectedOffer;
}

Product.prototype.getExpectedOffer = function() {
    return this.expectedOffer;
}

// Product description
Product.prototype.setProductDesc = function(productDesc) {
	this.productDesc = productDesc;
}

Product.prototype.getProductDesc = function() {
    return this.productDesc;
}

// Product expiry date
Product.prototype.setProductExpiryDate = function(productExpiryDate) {
	this.productExpiryDate = productExpiryDate;
}

Product.prototype.getProductExpiryDate = function() {
    return this.productExpiryDate;
}

// Is product valid
Product.prototype.setIsValid = function(isValid) {
	this.isValid = isValid;
}

Product.prototype.getIsValid = function() {
    return this.isValid;
}

//Is product valid
Product.prototype.setCategory = function(category) {
	this.category = category;
}

Product.prototype.getCategory = function() {
    return this.category;
}

Product.prototype.validateProductId = function(messageText) {
	var validator = new Validator();
	if(messageText != undefined) {
		validator.validateNumber(this.getProductId(), messageText);
	} else {
		validator.validateNumber(this.getProductId(), 'Product Id');
	}
	return validator.getErrorList();
}

Product.prototype.getValuesMap = function() {
	var Map = require('./map');
	var m = new Map();
	m.add(Constants.PRODUCT_NAME, this.getproductName());
	m.add(Constants.QUANTITY, this.getQuantity());
	m.add(Constants.USER_ID, this.getUser().getUserId());
	m.add(Constants.EXPECTED_OFFER, this.getExpectedOffer());
	m.add(Constants.PRODUCT_DESC, this.getProductDesc());
	if(this.getProductExpiryDate() != undefined) {
		m.add(Constants.PRODUCT_EXPIRY_DATE, new Date(this.getProductExpiryDate()));
	}
	m.add(Constants.IS_VALID, this.getIsValid());
	m.add(Constants.CATEGRY_ID, this.getCategory().getCategoryId());
    return m.getMap();
}

Product.prototype.validate = function() {
	var validator = new Validator();
	
	validator.validateText(this.getproductName(), 'Product Name', 45);
	validator.validateNumber(this.getQuantity(), 'Quantity');
	
	// User id validations
	var userValidator = this.getUser().validateUserId('Seller Id');
	if(!userValidator[Constants.STATUS]) {
		validator.pushError(userValidator[Constants.ERRORS][0]);
	}
	
	validator.validateText(this.getProductDesc(), 'Product Description');
	validator.validateBlank(this.getExpectedOffer(), 'Expected Offer');
	validator.validateDate(this.getProductExpiryDate(), 'Product Expiry Date');
	
	// Category id validations
	var categoryValidator = this.getCategory().validateCategoryId();
	if(!categoryValidator[Constants.STATUS]) {
		validator.pushError(categoryValidator[Constants.ERRORS][0]);
	}
	return validator.getErrorList();
}

module.exports = Product;