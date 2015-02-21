var Product = require('../models/product');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.getProductsByCategoryId = function(req, res) {
	var p = new Product();
	p.createFromRequest(req);
	var errors = p.getCategory().validateCategoryId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "SELECT * FROM " + Constants.PRODUCT_TABLE + " p, " + Constants.CATEGORY_TABLE +
					" c WHERE " +
						"p." + Constants.CATEGORY_ID + " = " + "c." + Constants.CATEGORY_ID + 
					" AND " +
						"c." + Constants.CATEGORY_ID + " = " + p.getCategory().getCategoryId() +
					" AND " +
						"p." + Constants.IS_VALID + " = 1";
		db.execSQL(query, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching product details";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				if(result.length > 0) {
					var response = {};
					response[Constants.PRODUCTS] = result;
					Utility.writeSuccessJSON(res, response, 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Products does not exist under specified category');
				}
			}
		});
	}
};

exports.createProduct = function(req, res) {
	var p = new Product();
	p.createFromRequest(req);
	var errors = p.validate();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		db.insert(Constants.PRODUCT_TABLE, p.getValuesMap(), function(err, result) {
			console.log(result);
			if(err) {
				var errorMessage = "Error occurred while creating product";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				var response = {};
				response[Constants.PRODUCT_ID] =  result.insertId;
				Utility.writeSuccessCreateJSON(res, response, 'Product created successfully');
			}
		});
	}
};

exports.getProductByProductId = function(req, res) {
	var p = new Product();
	p.createFromRequest(req);
	var errors = p.validateProductId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "SELECT * FROM " + Constants.PRODUCT_TABLE +
		" WHERE " +
			Constants.PRODUCT_ID + " = " + p.getProductId() + 
		" AND " +
			Constants.IS_VALID + " = 1";
		
		db.execSQL(query, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching product details";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				if(result.length > 0) {
					Utility.writeSuccessJSON(res, result[0], 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Product does not exist');
				}
			}
		});
	}
};

exports.updateProduct = function(req, res) {
	var p = new Product();
	p.createFromRequest(req);
	var errors = p.validateProductId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var updateQuery = "UPDATE " + Constants.PRODUCT_TABLE + " SET ? WHERE " + Constants.PRODUCT_ID + " = "  + p.getProductId();
		console.log(updateQuery);
		console.log(p.getValuesMap());
		db.update(updateQuery, p.getValuesMap(), function(err, result) {
			if(err) {
				Utility.writeFailureJSON(res, "Error occurred while updating product");
			} else {
				if(result.affectedRows > 0) {
					Utility.writeSuccessJSON(res, {}, 'Product updated successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Product not found');
				}
			}
		});
	}
};

exports.deleteProduct = function(req, res) {
	var p = new Product();
	p.createFromRequest(req);
	var errors = p.validateProductId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		
		var softDeleteQuery = "UPDATE " + Constants.PRODUCT_TABLE + " SET " + Constants.IS_VALID + " = 0 " +
			" WHERE " +
				Constants.PRODUCT_ID + " = "  + p.getProductId() + 
			" AND " +
				Constants.IS_VALID + " = 1";
		db.update(softDeleteQuery, p.getValuesMap(), function(err, result) {
			if(err) {
				Utility.writeFailureJSON(res, "Error occurred while deleting product");
			} else {
				if(result.affectedRows > 0) {
					Utility.writeSuccessJSON(res, {}, 'Product deleted successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Product not found');
				}
			}
		});
		
		/* Hard delete
		var query = "DELETE FROM " + Constants.PRODUCT_TABLE + " WHERE " + Constants.PRODUCT_ID + "=" + p.getProductId();
		db.execSQL(query, function(err, result) {
			if(err) {
				Utility.writeFailureJSON(res, "Error occurred while deleting product");
			} else {
				Utility.writeSuccessJSON(res, {}, 'Product deleted successfully');
			}
		}); */
	}
};