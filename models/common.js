var mysql = require('mysql');
var dbPoolConfig = require('../config/dbPoolConfig');

var dbPool = mysql.createPool(dbPoolConfig);

//var hostAddress = 'https://127.0.0.1:4433';
//var hostAddress = 'https://localhost:4433';
var hostAddress = 'https://ec2-52-78-137-47.ap-northeast-2.compute.amazonaws.com:4433';

module.exports.dbPool = dbPool;
module.exports.hostAddress = hostAddress;