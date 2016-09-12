var dbPool = require('../models/common').dbPool;

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

module.exports.getRegID = getRegID;