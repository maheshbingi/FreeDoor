// UPDATE mysql.user SET Password=PASSWORD('root') WHERE User='root';
// FLUSH PRIVILEGES;

var mysql = require('mysql');
var IP			= 'localhost';
var USER_NAME	= 'root';
var PASSWORD	= 'root';
var PORT		= '3306';
var DB_NAME		= 'freedoor';

var databaseConf = {
	host		: IP,
	user		: USER_NAME,
	password	: PASSWORD,
	port		: PORT,
	database	: DB_NAME
};
var pool =  mysql.createPool(databaseConf);

var masterConfig = {
	host		: '192.168.0.151',
	user		: USER_NAME,
	password	: PASSWORD,
	port		: PORT,
	database	: DB_NAME
};

var slave1Config =  {
	host		: '192.168.0.152',
	user		: USER_NAME,
	password	: PASSWORD,
	port		: PORT,
	database	: DB_NAME
};

/*var poolCluster = mysql.createPoolCluster();
poolCluster.add('MASTER', masterConfig);
poolCluster.add('SLAVE1', slave1Config);*/

function executeQuery(query, valueMap, callback) {
	/*poolCluster.of('*').getConnection(function (err, connection) {
		connection.query(query, function(err, result) {
			if((typeof callback !== 'undefined') && (callback !== null)) {
				if(err) {
					console.log(err);
				}
				callback(err, result);
			}
		});
		connection.release();
	});*/
	

	pool.getConnection(function(err, connection) {
		connection.query( query, valueMap, function(err, result) {
			if((typeof callback !== 'undefined') && (callback !== null)) {
				if(err) {
					console.log(err);
				}
				callback(err, result);
			}
		});
		connection.release();
	});
}

/**
 * Executes SQL statement
 * @param query Query which is to be executed
 * @param callback Callback function
 */
exports.execSQL = function(query, callback) {
	executeQuery(query, null, callback);
};

/**
 * Executes SQL insert statement
 * @param tableName Table name specifying in which table data has to be inserted
 * @param valueMap Map of values which are to be inserted
 * @param callback Callback function
 */
exports.insert = function(tableName, valueMap, callback) {
	var query = 'INSERT INTO ' + tableName + ' SET ? ';
	console.log(valueMap);
	executeQuery(query, valueMap, callback);
};

/**
 * Executes SQL update statement
 * @param query SQL query
 * @param valueMap Map of values which are to be updated
 * @param callback Callback function
 */
exports.update = function(query, valueMap, callback) {
	executeQuery(query, valueMap, callback);
};

/**
 * Configurations which will be used while initializing database ONLY (As db name is missing)
 */
var initDbConf = {
	host		: IP,
	user		: USER_NAME,
	password	: PASSWORD,
	port		: PORT,
	database	: ''
};

/**
 * Executes db initialize queries
 */
exports.execDbInitSQL = function(query, callback) {
	var dbInitConnection =  mysql.createConnection(initDbConf);
	dbInitConnection.query( query, null, function(err, result) {
		if((typeof callback !== 'undefined') && (callback !== null)) {
			callback(err, result);
		}
	});
	dbInitConnection.end();
};