var Validator = require('./validator');
var Constants = require('./constants');

var Category = function (categoryId, categoryName) {
	this.categoryId = categoryId;
	this.categoryName = categoryName;
}

/**
 * Creates Category object from http request object
 * @param req
 */
Category.prototype.createFromRequest = function(req) {
	this.categoryId = req.param(Constants.CATEGORY_ID, undefined);
	this.categoryName = req.param(Constants.CATEGORY_NAME, undefined);
}

Category.prototype.setCategoryId = function(categoryId) {
	this.categoryId = categoryId;
}

Category.prototype.getCategoryId = function() {
    return this.categoryId;
}

Category.prototype.setCategoryName = function(categoryName) {
	this.categoryName = categoryName;
}

Category.prototype.getCategoryName = function() {
    return this.categoryName;
}

//Values map
Category.prototype.getValuesMap = function() {
	var Map = require('./map');
	var m = new Map();
	m.add(Constants.CATEGORY_ID, this.getCategoryId());
	m.add(Constants.CATEGORY_NAME, this.getCategoryName());
    return m.getMap();
}

Category.prototype.validateCategoryId = function() {
	var validator = new Validator();
	validator.validateNumber(this.getCategoryId(), 'Category Id');
	return validator.getErrorList();
}

Category.prototype.validate = function() {
	var validator = new Validator();
	validator.validateText(this.getCategoryName(), 'Category Name', 45);
	return validator.getErrorList();
}

module.exports = Category;