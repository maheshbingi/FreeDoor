var fs = require('fs');
var db = require('./dbHandler');

var DbInitializer = function () {};

DbInitializer.initializeDb = function(callBack) {
	var dbScriptPath = __dirname + '/freedoor.sql';
	this.executeSQLFile(dbScriptPath, callBack);
};

DbInitializer.executeSQLFile = function(filePath, callBack) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err) {
			console.log(err);
		} else {
			lines = data.split(";");
			// console.log("Total Lines ======> " + lines.length);
			executeLine(0, callBack);
		}
	});
}

/**
 * Executes each sql command sequentially
 */
function executeLine(index, callBack) {
	// console.log("SQL --> " + lines[index]);
	db.execDbInitSQL(lines[index], function(err, result) {
		index++;
		if(err) {
			// console.log("Error --> " + err);
		}
		
		if(index < lines.length - 1) {
			executeLine(index, callBack);
		} else {
			if(callBack != null) {
				callBack();
			}
		}
	});
}

module.exports = DbInitializer;