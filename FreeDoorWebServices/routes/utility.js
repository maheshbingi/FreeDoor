var Constants = require('../models/constants');

/**
 * Writes success JSON response
 */
exports.writeSuccessJSON = function(response, data, message) {
	data[Constants.STATUS] = true;
	if(message != null) {
		data[Constants.MESSAGE] = message;
	}
	response.writeHead(200, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(data));
	response.end();
};

/**
 * Writes success JSON response
 */
exports.writeSuccessCreateJSON = function(response, data, message) {
	data[Constants.STATUS] = true;
	if(message != null) {
		data[Constants.MESSAGE] = message;
	}
	response.writeHead(201, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(data));
	response.end();
};

/**
 * Writes NOT FOUND JSON response
 */
exports.writeNotFoundJSON = function(response, errorMessage) {
	var errors ={};
	errors[Constants.STATUS] = false;
	errors[Constants.ERRORS] = [errorMessage];
	response.writeHead(404, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(errors));
	response.end();
};

/**
 * Writes failure JSON response
 */
exports.writeFailureJSON = function(response, errorMessage) {
	var errors ={};
	errors[Constants.STATUS] = false;
	errors[Constants.ERRORS] = [errorMessage];
	response.writeHead(500, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(errors));
	response.end();
};

/**
 * Writes custom failure JSON response
 */
exports.writeCustomFailureJSON = function(response, errorJSON) {
	response.writeHead(500, {'Content-Type' : 'application/json'});   
	response.write(JSON.stringify(errorJSON));
	response.end();
};