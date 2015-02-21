var User = require('../models/user');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.createUser = function(req, res) {
	var u = new User();
	u.createFromRequest(req);
	var errors = u.validate();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		db.insert(Constants.USER_TABLE, u.getValuesMap(), function(err, result) {
			console.log(result);
			if(err) {
				var errorMessage = "Error occurred while creating user";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				var response = {};
				response[Constants.USER_ID] =  result.insertId;
				Utility.writeSuccessCreateJSON(res, response, 'User created successfully');
			}
		});
	}
};

exports.getUserById = function(req, res) {
	var u = new User();
	u.createFromRequest(req);

	var errors = u.validateUserId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "SELECT * FROM " + Constants.USER_TABLE + " WHERE " + Constants.USER_ID + "=" + u.getUserId();
		db.execSQL(query, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching user details";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				if(result.length > 0) {
					Utility.writeSuccessJSON(res, result[0], 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'User does not exist');
				}
			}
		});
	}
};