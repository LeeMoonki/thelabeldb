var dbPool = require('../models/common').dbPool;
var async = require('async');

function getRegID(userId, callback) {
  var sql_select_regId = 'select registrationID from user where id = ? ';
  
  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      dbConn.query(sql_select_regId, [userId], function(err, results){
        dbConn.release();
        if (err) {
          return callback(err);
        } else {
          callback(null, results[0].registrationID);
        }
      });
    }
  });

}

function insertMessage(userId, youId, msg, callback) {

  var sql_insert_message = 'INSERT INTO `thelabeldb`.`message` (`user_id`, `you_user_id`, `text`) VALUES (?, ?, ?) ';

  dbPool.getConnection(function (err, dbConn) {
    if (err) {
      return callback(err);
    } else {

      dbConn.beginTransaction(function (err) {
        if (err) {
          dbConn.release();
          return callback(err);
        } else {
          dbConn.query(sql_insert_message, [userId, youId, msg], function (err, result) {
            if (err) {
              return dbConn.rollback(function () {
                dbConn.release();
                callback(err);
              });
            } else {
              dbConn.commit(function () {
                dbConn.release();
                callback(null, result.insertId);
              });
            }
          });
        }
      });
    }
  });
}


function findMessage(userId, youId, date, callback) {
  var sql_select_messages = 'select id, user_id, you_user_id, text, ' +
    'date_format(convert_tz(ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date ' +
    'from message ' +
    'where ctime > date_format(?, "%Y-%m-%d %H:%i:%s") and user_id = ? and you_user_id = ? ' +
    'order by ctime desc ';

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      dbConn.query(sql_select_messages, [date, userId, youId], function(err, results){
        dbConn.release();
        if (err) {
          return callback(err);
        } else {
          callback(null, results);
        }
      });
    }
  });

}


module.exports.getRegID = getRegID;
module.exports.insertMessage = insertMessage;
module.exports.findMessage = findMessage;