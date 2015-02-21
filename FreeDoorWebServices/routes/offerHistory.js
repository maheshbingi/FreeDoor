var Offer = require('../models/offer');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.getOfferHistoryByOfferId = function(req, res) {
	var offer = new Offer();
	offer.createFromRequest(req);
	var errors = offer.validateOfferId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var query = "SELECT oh.* FROM " + Constants.OFFER_HISTORY_TABLE + " oh, " + Constants.OFFER_TABLE + " o " +
		" WHERE " +
			"oh." + Constants.OFFER_ID + " = " + "o." + Constants.OFFER_ID +
		" AND o." +
			Constants.OFFER_ID + " = " + offer.getOfferId();
		
		db.execSQL(query, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching offer history details";
				Utility.writeFailureJSON(res, errorMessage);
			
			} else {
				if(result.length > 0) {
					var response = {};
					response[Constants.HISTORY] = result;
					Utility.writeSuccessJSON(res, response, 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Offer history does not exist under specified offer');
				}
			}
		});
	}
};