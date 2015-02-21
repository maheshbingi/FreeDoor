var Validator = require('./validator');
var Constants = require('./constants');

var User = function (userId, firstName, lastName, emailId, mobile) {
	this.userId = userId;
	this.firstName = firstName;
	this.lastName = lastName;
	this.emailId = emailId;
	this.mobile = mobile;
}

/**
 * Creates User object from http request object
 * @param req
 */
User.prototype.createFromRequest = function(req) {
	this.userId = req.param(Constants.USER_ID, undefined);
	this.firstName = req.param(Constants.FIRST_NAME, undefined);
	this.lastName = req.param(Constants.LAST_NAME, undefined);
	this.emailId = req.param(Constants.EMAIL_ID, undefined);
	this.mobile = req.param(Constants.MOBILE, undefined);
}

/**
 * Creates User object from db resultset
 * @param rs
 */
User.prototype.createFromResultset = function(rs) {
}

// User Id
User.prototype.setUserId = function(userId) {
	this.userId = userId;
}

User.prototype.getUserId = function() {
    return this.userId;
}

// First name
User.prototype.setFirstName = function(firstName) {
	this.firstName = firstName;
}

User.prototype.getFirstName = function() {
    return this.firstName;
}

// Last name
User.prototype.setLastName = function(lastName) {
	this.lastName = lastName;
}

User.prototype.getLastName = function() {
    return this.lastName;
}

// Email id
User.prototype.setEmailId = function(emailId) {
	this.emailId = emailId;
}

User.prototype.getEmailId = function() {
    return this.emailId;
}

/**
 * Sets mobile
 */
User.prototype.setMobile = function(mobile) {
	this.mobile = mobile;
}

User.prototype.getMobile = function() {
    return this.mobile;
}

// Values map
User.prototype.getValuesMap = function() {
	var Map = require('./map');
	var m = new Map();
	m.add(Constants.FIRST_NAME, this.getFirstName());
	m.add(Constants.LAST_NAME, this.getLastName());
	m.add(Constants.EMAIL_ID, this.getEmailId());
	m.add(Constants.MOBILE, this.getMobile());
    return m.getMap();
}

User.prototype.validateUserId = function(messageText) {
	var validator = new Validator();
	if(messageText != undefined) {
		validator.validateNumber(this.getUserId(), messageText);
	} else {
		validator.validateNumber(this.getUserId(), 'User Id');
	}
	return validator.getErrorList();
}

/**
 * Validates all the fields except user id
 */
User.prototype.validate = function() {
	var validator = new Validator();
	validator.validateText(this.getFirstName(), 'First Name', 45);
	validator.validateText(this.getLastName(), 'Last Name', 45);
	validator.validateEmail(this.getEmailId(), 'Email Id');
	validator.validateNumber(this.getMobile(), 'Mobile');
	return validator.getErrorList();
}

module.exports = User;