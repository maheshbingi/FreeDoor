var Validator = require('./validator');
var Constants = require('./constants');
var Product = require('./product');
var User = require('./user');

var Offer = function (offerId, buyingQty, offeredDetails, buyerStatus,
		sellerStatus, offerExpiry, productId, buyerId, lastModified) {
	this.offerId = offerId;
	this.buyingQty = buyingQty;
	this.offeredDetails = offeredDetails;
	this.buyerStatus = buyerStatus;
	this.sellerStatus = sellerStatus;
	this.offerExpiry = offerExpiry;
	this.buyer = new User(buyerId);
	this.product = new Product(productId);
	this.lastModified = lastModified;
}

Offer.prototype.createFromRequest = function(req) {
	this.offerId = req.param(Constants.OFFER_ID, undefined);
	this.buyingQty = req.param(Constants.BUYING_QTY, undefined);
	this.offeredDetails = req.param(Constants.OFFERED_DETAILS, undefined);
	this.buyerStatus = req.param(Constants.BUYER_STATUS, undefined);
	this.sellerStatus = req.param(Constants.SELLER_STATUS, undefined);
	this.offerExpiry = req.param(Constants.OFFER_EXPIRY, undefined);
	this.buyer = new User(req.param(Constants.BUYER_ID, undefined));
	this.product = new Product();
	this.product.createFromRequest(req);
	this.lastModified = req.param(Constants.LAST_MODIFIED, undefined);
}

// Offer Id
Offer.prototype.setOfferId = function(offerId) {
	this.offerId = offerId;
}

Offer.prototype.getOfferId = function() {
    return this.offerId;
}

// Buying Qty
Offer.prototype.setBuyingQty = function(buyingQty) {
	this.buyingQty = buyingQty;
}

Offer.prototype.getBuyingQty = function() {
    return this.buyingQty;
}

// Buyer
Offer.prototype.setBuyer = function(buyer) {
	this.buyer = buyer;
}

Offer.prototype.getBuyer = function() {
    return this.buyer;
}

// Offered details
Offer.prototype.setOfferedDetails = function(offeredDetails) {
	this.offeredDetails = offeredDetails;
}

Offer.prototype.getOfferedDetails = function() {
    return this.offeredDetails;
}

// Buyer status
Offer.prototype.setBuyerStatus = function(buyerStatus) {
	this.buyerStatus = buyerStatus;
}

Offer.prototype.getBuyerStatus = function() {
    return this.buyerStatus;
}

// Seller status
Offer.prototype.setSellerStatus = function(sellerStatus) {
	this.sellerStatus = sellerStatus;
}

Offer.prototype.getSellerStatus = function() {
    return this.sellerStatus;
}

// Offer expiry
Offer.prototype.setOfferExpiry = function(offerExpiry) {
	this.offerExpiry = offerExpiry;
}

Offer.prototype.getOfferExpiry = function() {
    return this.offerExpiry;
}

// Product
Offer.prototype.setProduct = function(product) {
	this.product = product;
}

Offer.prototype.getProduct = function() {
    return this.product;
}

Offer.prototype.getValuesMap = function() {
	var Map = require('./map');
	var m = new Map();
	m.add(Constants.OFFER_ID, this.getOfferId());
	m.add(Constants.BUYING_QTY, this.getBuyingQty());
	m.add(Constants.OFFERED_DETAILS, this.getOfferedDetails());
	m.add(Constants.BUYER_STATUS, this.getBuyerStatus());
	m.add(Constants.SELLER_STATUS, this.getSellerStatus());
	
	if(this.getOfferExpiry() != undefined) {
		m.add(Constants.OFFER_EXPIRY, new Date(this.getOfferExpiry()));
	}
	
	m.add(Constants.PRODUCT_ID, this.getProduct().getProductId());
	m.add(Constants.BUYER_ID, this.getBuyer().getUserId());
	
	m.add(Constants.LAST_MODIFIED, new Date());
    return m.getMap();
}

Offer.prototype.validateOfferId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getOfferId(), 'Offer Id');
	return validator.getErrorList();
}

Offer.prototype.validateUpdateOfferParameters = function() {
	var validator = new Validator();
	validator.validateNumber(this.getOfferId(), 'Offer Id');
	validator.validateNumber(this.getBuyingQty(), 'Buying Quantity');
	return validator.getErrorList();
}

Offer.prototype.validate = function() {
	var validator = new Validator();
	validator.validateNumber(this.getBuyingQty(), 'Buying Quantity');
	
	validator.validateText(this.getOfferedDetails(), 'Offered Details');

	validator.validateSellerBuyerStatus(this.getBuyerStatus(), 'Buyer Status');
	validator.validateSellerBuyerStatus(this.getSellerStatus(), 'Seller Status');
	validator.validateDate(this.getOfferExpiry(), 'Offer Expiry Date');
	
	// Product id validations
	var productValidator = this.getProduct().validateProductId('Product Details');
	if(!productValidator[Constants.STATUS]) {
		validator.pushError(productValidator[Constants.ERRORS][0]);
	}
	
	// User id validations
	var userValidator = this.getBuyer().validateUserId('Buyer Id');
	if(!userValidator[Constants.STATUS]) {
		validator.pushError(userValidator[Constants.ERRORS][0]);
	}
	
	return validator.getErrorList();
}


module.exports = Offer;