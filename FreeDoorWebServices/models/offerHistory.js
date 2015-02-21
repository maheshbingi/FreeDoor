var Validator = require('./validator');
var Constants = require('./constants');

var OfferHistory = function (offerHistoryId, modified, lastModified, offerId) {
	this.offerHistoryId = offerHistoryId;
	this.modified = modified;
	this.lastModified = lastModified;
	this.offer = new Offer(offerId);
}

// User Id
OfferHistory.prototype.setOfferHistoryId = function(offerHistoryId) {
	this.offerHistoryId = offerHistoryId;
}

OfferHistory.prototype.getOfferHistoryId = function() {
    return this.offerHistoryId;
}

// Modified
OfferHistory.prototype.setModified = function(modified) {
	this.modified = modified;
}

OfferHistory.prototype.getModified = function() {
    return this.modified;
}

// Last modified
OfferHistory.prototype.setLastModified = function(lastModified) {
	this.lastModified = lastModified;
}

OfferHistory.prototype.getLastModified = function() {
    return this.lastModified;
}

// Offer
OfferHistory.prototype.setOffer = function(offer) {
	this.offer = offer;
}

OfferHistory.prototype.getOffer = function() {
    return this.offer;
}

module.exports = OfferHistory;