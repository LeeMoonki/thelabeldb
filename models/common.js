// TODO : dbPool 만들기
var mysql = require('mysql');
var dbPoolConfig = require('../config/dbPoolConfig');

var dbPool = mysql.createPool(dbPoolConfig);

module.exports.dbPool = dbPool;