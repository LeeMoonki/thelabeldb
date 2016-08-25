var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var Alarm = require('../models/alarm');

var dbPool = require('../models/common').dbPool;


/* GET users listing. */
router.get('/', function(req, res, next) {
    var sql = 'select * from city';
    dbPool.getConnection(function (err, dbConn) {
       if (err) {
           return next (err);
       }
       else {
           dbConn.query(sql,[], function (err, results) {
               dbConn.release();
               if(err) {
                   return next(err);
               }
               else {
                   res.send({
                      results: results
                   });
               }
           })
       }
    });
    // res.send('aaa');
});

router.post('/', function (req, res, next) {
   res.send({
     message: "post alarm"
   });
});

module.exports = router;