var Validator = require('./validator');
var Constants = require('./constants');
var User = require('./user');
var Offer = require('./offer');

var Comment = function (commentId, commentDesc, lastUpdated, offerId, userId) {
	this.setCommentId(commentId);
	this.commentDesc = commentDesc;
	this.lastUpdated = lastUpdated;
	this.offerId = new Offer(offerId);
	this.user = new User(userId);
}

/**
 * Creates Comment object from http request object
 * @param req
 */
Comment.prototype.createFromRequest = function(req) {
	this.commentId = req.param(Constants.COMMENT_ID, undefined);
	this.commentDesc = req.param(Constants.COMMENT_DESC, undefined);
	this.lastUpdated = req.param(Constants.LAST_UPDATED, undefined);
	this.offer = new Offer(req.param(Constants.OFFER_ID, undefined));
	this.user = new User(req.param(Constants.USER_ID, undefined));
}

Comment.prototype.setCommentId = function(commentId) {
	this.commentId = commentId;
}

Comment.prototype.getCommentId = function() {
    return this.commentId;
}

// Comment Description
Comment.prototype.setCommentDesc = function(commentDesc) {
	this.commentDesc = commentDesc;
}

Comment.prototype.getCommentDesc = function() {
    return this.commentDesc;
}

// Last updated
Comment.prototype.setLastUpdated = function(lastUpdated) {
	this.lastUpdated = lastUpdated;
}

Comment.prototype.getLastUpdated = function() {
    return this.lastUpdated;
}

// Offer
Comment.prototype.setOffer = function(offer) {
	this.offer = offer;
}

Comment.prototype.getOffer = function() {
    return this.offer;
}

// User
Comment.prototype.setUser = function(user) {
	this.user = user;
}

Comment.prototype.getUser= function() {
    return this.user;
}

//Values map
Comment.prototype.getValuesMap = function() {
	var Map = require('./map');
	var m = new Map();
	m.add(Constants.COMMENT_ID, this.getCommentId());
	m.add(Constants.COMMENT_DESC, this.getCommentDesc());
	m.add(Constants.LAST_UPDATED, new Date());
	m.add(Constants.OFFER_ID, this.getOffer().getOfferId());
	m.add(Constants.USER_ID, this.getUser().getUserId());
    return m.getMap();
}

Comment.prototype.validateCommentId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getCommentId(), 'Comment Id');
	return validator.getErrorList();
}

Comment.prototype.validate = function() {
	var validator = new Validator();
	validator.validateText(this.getCommentDesc(), 'Comment Description', 200);
	
	var userValidator = this.getUser().validateUserId('User Id');
	if(!userValidator[Constants.STATUS]) {
		validator.pushError(userValidator[Constants.ERRORS][0]);
	}
	
	var offerValidator = this.getOffer().validateOfferId('Offer Id');
	if(!offerValidator[Constants.STATUS]) {
		validator.pushError(offerValidator[Constants.ERRORS][0]);
	}
	return validator.getErrorList();
}

module.exports = Comment;