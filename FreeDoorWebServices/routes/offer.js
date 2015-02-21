var Offer = require('../models/offer');
var Utility = require('./utility');
var db = require('../db/dbHandler');
var Constants = require('../models/constants');

exports.getOffersByProductId = function(req, res) {
	var offer = new Offer();
	offer.createFromRequest(req);
	var errors = offer.getProduct().validateProductId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {

		var offerQuery = "SELECT o.* FROM " +  Constants.OFFER_TABLE + " o, " + Constants.PRODUCT_TABLE + " p " +
		" WHERE " + "o." + Constants.PRODUCT_ID + " = " + "p." + Constants.PRODUCT_ID + " AND p." + Constants.PRODUCT_ID + " = " + offer.getProduct().getProductId();
		db.execSQL(offerQuery, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching offer details";
				Utility.writeFailureJSON(res, errorMessage);
			
			} else {
				if(result.length > 0) {
					var response = {};
					response[Constants.OFFERS] = result;
					Utility.writeSuccessJSON(res, response, 'Details fetched successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Offer does not exist under specified product');
				}
			}
		});
	}
};

exports.createOffer = function(req, res) {
	var o = new Offer();
	o.createFromRequest(req);
	var errors = o.validate();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		db.insert(Constants.OFFER_TABLE, o.getValuesMap(), function(err, result) {
			if(err) {
				var errorMessage;
				switch(err.errno) {
					case 1452:
						if(err.message.indexOf(Constants.PRODUCT_ID) > -1) {
							
							errorMessage = "Incorrect product id";
							
						} else if(err.message.indexOf(Constants.BUYER_ID) > -1) {
							
							errorMessage = "Incorrect buyer id";
							
						} else {
							
							errorMessage = "Error occurred while creating product";
							
						}
						break;
					default:
						errorMessage = "Error occurred while creating product";
						break;
				}
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				var response = {};
				response[Constants.OFFER_ID] =  result.insertId;
				Utility.writeSuccessCreateJSON(res, response, 'Offer created successfully');
			}
		});
	}
};

exports.getOfferByOfferId = function(req, res) {
	var offer = new Offer();
	offer.createFromRequest(req);
	var errors = offer.validateOfferId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		
		var offerQuery = "SELECT " +
			Constants.OFFER_TABLE + "." + Constants.OFFER_ID + ", " +
			Constants.OFFER_TABLE + "." + Constants.BUYING_QTY + ", " +
			Constants.OFFER_TABLE + "." + Constants.OFFERED_DETAILS + ", " +
			Constants.OFFER_TABLE + "." + Constants.BUYER_STATUS + ", " +
			Constants.OFFER_TABLE + "." + Constants.SELLER_STATUS + ", " +
			Constants.OFFER_TABLE + "." + Constants.OFFER_EXPIRY + ", " +
			Constants.OFFER_TABLE + "." + Constants.PRODUCT_ID + ", " +
			Constants.OFFER_TABLE + "." + Constants.BUYER_ID + ", " +
			Constants.OFFER_TABLE + "." + Constants.LAST_MODIFIED + ", " +
			Constants.OFFER_HISTORY_TABLE + "." + Constants.MODIFIED + " as lastEvent, " +
			"max(" + Constants.OFFER_HISTORY_TABLE + "." + Constants.LAST_MODIFIED +  ") as lastEventDateTime " +
		" FROM " + Constants.OFFER_TABLE +
		" LEFT JOIN  " + Constants.OFFER_HISTORY_TABLE +
		" ON " + Constants.OFFER_TABLE + "." + Constants.OFFER_ID + " = " + Constants.OFFER_HISTORY_TABLE + "." + Constants.OFFER_ID +
		" WHERE " + Constants.OFFER_TABLE + "." + Constants.OFFER_ID + " = " + offer.getOfferId();
		
		db.execSQL(offerQuery, function(err, result) {
			if(err) {
				var errorMessage = "Error occurred while fetching offer details";
				Utility.writeFailureJSON(res, errorMessage);
			
			} else {

				if(result.length > 0 && result[0][Constants.OFFER_ID] != undefined) {
					var offerCommentsQuery =
						"SELECT c." + Constants.COMMENT_ID + ", c." + Constants.COMMENT_DESC + ", c." + Constants.LAST_UPDATED + ", c." + Constants.OFFER_ID + ", c." + Constants.USER_ID +
						" FROM " + Constants.COMMENT_TABLE + " c, " + Constants.OFFER_TABLE + " o " + 
						" WHERE c." +
							Constants.OFFER_ID +  " = " + "o." + Constants.OFFER_ID +
						" AND " +
							"o." + Constants.OFFER_ID + " = " + offer.getOfferId();
					
					db.execSQL(offerCommentsQuery, function(commentsErr, commentsResult) {
						
						if(commentsErr) {
							
							Utility.writeSuccessJSON(res, result[0], 'Offer details fetched successfully. But error occurred while fetching comments');

						} else if(commentsResult != undefined) {
							
							var response = {};
							result[0][Constants.COMMENTS] = commentsResult;
							Utility.writeSuccessJSON(res, result[0], 'Details fetched successfully');
							
						}
					});

				} else {
					Utility.writeNotFoundJSON(res, 'Offer does not exist');
				}
			}
		});
	}
};

exports.updateOffer = function(req, res) {
	var offer = new Offer();
	offer.createFromRequest(req);
	var errors = offer.validateUpdateOfferParameters();
	
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		var getProductQuantityQuery = "SELECT " + Constants.QUANTITY + " FROM " + Constants.PRODUCT_TABLE + 
			" WHERE " +
				Constants.PRODUCT_ID + " = " + offer.getProduct().getProductId();
		
		db.execSQL(getProductQuantityQuery, function(err, result) {

			if(err) {
				var errorMessage = "Error occurred while fetching product quantity";
				Utility.writeFailureJSON(res, errorMessage);
			} else {
				
				var productQuantity = result[0][Constants.QUANTITY];
				
				// Check whether the product quantity is lesser or equal to buying quantity
				if(offer.getBuyingQty() <= productQuantity || offer.getBuyingQty() == undefined) {
					var updateQuery = "UPDATE " + Constants.OFFER_TABLE + " SET ? WHERE " + Constants.OFFER_ID + " = "  + offer.getOfferId();
					
					db.update(updateQuery, offer.getValuesMap(), function(err, result) {
						console.log(result);
						if(err) {
							var errorMessage;
							switch(err.errno) {
								case 1452:
									if(err.message.indexOf(Constants.PRODUCT_ID) > -1) {
										
										errorMessage = "Incorrect product id";
										
									} else if(err.message.indexOf(Constants.BUYER_ID) > -1) {
										
										errorMessage = "Incorrect buyer id";
										
									} else {
										
										errorMessage = "Error occurred while updating product";
										
									}
									break;
								default:
									errorMessage = "Error occurred while updating product";
									break;
							}
							Utility.writeFailureJSON(res, errorMessage);
							
						} else {
							if(result.affectedRows > 0) {

								var getOfferStatusQuery = "SELECT " + Constants.BUYER_STATUS + ", " + Constants.SELLER_STATUS + " FROM " + Constants.OFFER_TABLE +
									" WHERE " + Constants.OFFER_ID + " = " + offer.getOfferId();
								
								db.execSQL(getOfferStatusQuery, function(err, result) {

									if(err) {
										var errorMessage = "Error occurred while updating product details";
										Utility.writeFailureJSON(res, errorMessage);
									} else {
										
										var buyerStatus = result[0][Constants.BUYER_STATUS];
										var sellerStatus = result[0][Constants.SELLER_STATUS];
										
										// If offer is accepted update product quantity in product table
										if(buyerStatus == 'accepted' && sellerStatus == 'accepted') {
											var updateProductQuantityQuery = "UPDATE " + Constants.PRODUCT_TABLE + 
											" SET " +
												Constants.QUANTITY + " = (" + Constants.QUANTITY + " - " + offer.getBuyingQty() + ")" +
											" WHERE " +
												Constants.PRODUCT_ID + " = "  + offer.getProduct().getProductId();
											
											db.execSQL(updateProductQuantityQuery, function(err, result) {
												console.log(err);
											});
										}
										Utility.writeSuccessJSON(res, {}, 'Product updated successfully');
									}
								});
							} else {
								Utility.writeNotFoundJSON(res, 'Offer not found');
							}
						}
					});
				} else {
					Utility.writeFailureJSON(res, "Buying quantity is greater than offered quantity");
				}
			}
		});
		
		
	}
};

exports.deleteOffer = function(req, res) {
	var offer = new Offer();
	offer.createFromRequest(req);
	var errors = offer.validateOfferId();
	if(!errors[Constants.STATUS]) {
		Utility.writeCustomFailureJSON(res, errors);
	} else {
		
		var query = "DELETE FROM " + Constants.OFFER_TABLE + " WHERE " + Constants.OFFER_ID + "=" + offer.getOfferId();
		db.execSQL(query, function(err, result) {
			if(err) {
				Utility.writeFailureJSON(res, "Error occurred while deleting offer");
			} else {
				if(result.affectedRows > 0) {
					Utility.writeSuccessJSON(res, {}, 'Offer deleted successfully');
				} else {
					Utility.writeNotFoundJSON(res, 'Offer not found');
				}
			}
		});
	}
};