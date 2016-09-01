var mysql = require('mysql');
var dbPoolConfig = require('../config/dbPoolConfig');

var dbPool = mysql.createPool(dbPoolConfig);

var hostAddress = 'https://127.0.0.1:4433';

module.exports.dbPool = dbPool;
module.exports.hostAddress = hostAddress;