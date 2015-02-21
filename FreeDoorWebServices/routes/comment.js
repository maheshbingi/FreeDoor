var Comment = require('../models/comment');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.createComment = function(req, res) {
	var comment = new Comment();
	comment.createFromRequest(req);
	var errors = comment.validate();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		db.insert(Constants.COMMENT_TABLE, comment.getValuesMap(), function(err, result) {
			if(err) {
				var errorMessage;
				switch(err.errno) {
					case 1452:
						if(err.message.indexOf(Constants.OFFER_ID) > -1) {
							errorMessage = "Incorrect offer id";
						} else if(err.message.indexOf(Constants.USER_ID) > -1) {
							errorMessage = "Incorrect user id";
						} else {
							errorMessage = "Error occurred while creating comment";
						}
						break;
					default:
						errorMessage = "Error occurred while creating comment";
						break;
				}
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				var response = {};
				response[Constants.COMMENT_ID] =  result.insertId;
				Utility.writeSuccessCreateJSON(res, response, 'Comment created successfully');
			}
		});
	}
};

exports.updateComment = function(req, res) {
	var comment = new Comment();
	comment.createFromRequest(req);
	var errors = comment.validateCommentId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var updateQuery = "UPDATE " + Constants.COMMENT_TABLE + " SET ? WHERE " + Constants.COMMENT_ID + " = "  + comment.getCommentId();
		db.update(updateQuery, comment.getValuesMap(), function(err, result) {
			if(err) {
				var errorMessage;
				switch(err.errno) {
					case 1452:
						if(err.message.indexOf(Constants.OFFER_ID) > -1) {
							errorMessage = "Incorrect offer id";
						} else if(err.message.indexOf(Constants.USER_ID) > -1) {
							errorMessage = "Incorrect user id";
						} else {
							errorMessage = "Error occurred while creating comment";
						}
						break;
					default:
						errorMessage = "Error occurred while updating comment";
						break;
				}
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				if(result.affectedRows > 0) {
					Utility.writeSuccessJSON(res, {}, 'Comment updated successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Comment not found');
				}
			}
		});
	}
};

exports.deleteComment = function(req, res) {
	var comment = new Comment();
	comment.createFromRequest(req);
	var errors = comment.validateCommentId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "DELETE FROM " + Constants.COMMENT_TABLE + " WHERE " + Constants.COMMENT_ID + "=" + comment.getCommentId();
		db.execSQL(query, function(err, result) {
			if(err) {
				Utility.writeFailureJSON(res, "Error occurred while deleting comment");
			} else {
				if(result.affectedRows > 0) {
					Utility.writeSuccessJSON(res, {}, 'Comment deleted successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Comment not found');
				}
			}
		});
	}
};