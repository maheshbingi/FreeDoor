var Constants = require('./constants');
var ERROR = false;

var Validator = function () {
	this.errorList = {};
	this.errorList[Constants.ERRORS] = [];
	this.errorList[Constants.STATUS] = true;
}

Validator.prototype.validateText = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	/*if(!this.validateChar(value, fieldName)) {
		return false;
	}*/
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	return true;
}

Validator.prototype.validateNumber = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if(!this.validateNum(value, fieldName)) {
		return false;
	}
	if(value <= 0) {
		this.pushError(fieldName + " should be greater than zero");
		return false;
	}
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	return true;
}

Validator.prototype.validateChar = function(value, fieldName) {
	var isOnlyCharacters = /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(value);
	if(!isOnlyCharacters) {
		this.pushError("Numbers and special characters like '!,@,$,%,^,&,*' are not allowed in " + fieldName);
		// this.errorList[Constants.STATUS] = ERROR;
	}
	return isOnlyCharacters;
}

Validator.prototype.validateNum = function(value, fieldName) {
	var isOnlyNumbers = /^[0-9]+$/.test(value);
	if(!isOnlyNumbers) {
		this.pushError("Characters and special characters are not allowed in " + fieldName + ". Also value should be greater than zero");
		// this.errorList[Constants.STATUS] = ERROR;
	}
	return isOnlyNumbers;
}

Validator.prototype.validateBlank = function(value, fieldName) {
	if (value == undefined || value == Constants.ERROR_ID || value.toString().trim() == "") {
		this.pushError("Please enter " + fieldName);
		// this.errorList[Constants.STATUS] = ERROR;
		return false;
    }
	return true;
}

Validator.prototype.validatePrice = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if (isNaN(parseFloat(value))) {
    	this.pushError("Not a valid " + fieldName);
    	// this.errorList[Constants.STATUS] = ERROR;
        return false;
    }
	return true;
}

Validator.prototype.validateEmail = function(value, fieldName, requiredLength) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	
	var atpos = value.indexOf("@");
	var dotpos = value.lastIndexOf(".");
	if (atpos < 1 || dotpos < atpos+2 || dotpos + 2 >= value.length) {
		this.pushError("Not a valid e-mail address");
		// this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	
	if(!this.validateLength(value, fieldName, requiredLength)) {
		return false;
	}
	
	return true;
}

Validator.prototype.validateLength = function(value, fieldName, requiredLength) {
	if(value.length > requiredLength) {
		this.pushError(fieldName + " should not contain more than " + requiredLength + " characters");
		// this.errorList[Constants.STATUS] = ERROR;
		return false;
	}
	return true;
}

Validator.prototype.validateDate = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if (isNaN(Date.parse(value))) {//(!value.match(/^[0-3][0-9]\:[0-1][0-9]\:[0-2][0-9][0-9][0-9]\:[0-2][0-9]\:[0-6][0-9]\:[0-6][0-9]$/)) {
		this.pushError('Invalid ' + fieldName);
		// this.errorList[Constants.STATUS] = ERROR;
	    return false;
	}
}

Validator.prototype.validateSellerBuyerStatus = function(value, fieldName) {
	if(!this.validateBlank(value, fieldName)) {
		return false;
	}
	if (value != 'pending' && value != 'accepted' && value != 'rejected') {
		this.pushError('Incorrect ' + fieldName);
	    return false;
	}
}

Validator.prototype.pushError = function(error) {
	this.errorList[Constants.ERRORS].push(error);
	this.setStatus(ERROR);
}

Validator.prototype.setStatus = function(status) {
	this.errorList[Constants.STATUS] = status;
}

Validator.prototype.getErrorList = function() {
	return this.errorList;
}
module.exports = Validator;