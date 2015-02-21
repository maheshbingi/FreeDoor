var Category = require('../models/category');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.getAllCategories = function(req, res) {
	var query = "Select * from " + Constants.CATEGORY_TABLE;
	
	db.execSQL(query, function(err, result) {
		if(err) {
			var errorMessage = "Error occurred while fetching category details";
			Utility.writeFailureJSON(res, errorMessage);
		} else {
			if(result.length > 0) {
				var response = {};
				response[Constants.CATEGORIES] = result;
				Utility.writeSuccessJSON(res, response, 'Details fetched successfully');
			} else {
				Utility.writeNotFoundJSON(res, 'Category does not exist');
			}
		}
	});
	
};

exports.createCategory = function(req, res) {
	var c = new Category();
	c.createFromRequest(req);
	
	var errors = c.validate();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		db.insert(Constants.CATEGORY_TABLE, c.getValuesMap(), function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while creating category";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				var response = {};
				response[Constants.CATEGORY_ID] =  result.insertId;
				Utility.writeSuccessCreateJSON(res, response, 'Category created successfully');
			}
		});
	}
};

exports.getCategoryById = function(req, res) {
	var c = new Category();
	c.createFromRequest(req);
	
	var errors = c.validateCategoryId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "Select * from " + Constants.CATEGORY_TABLE + " WHERE " + Constants.CATEGORY_ID + "=" + c.getCategoryId();
		db.execSQL(query, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching category details";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				if(result.length > 0) {
					Utility.writeSuccessJSON(res, result[0], 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Category does not exist');
				}
			}
		});
	}
};