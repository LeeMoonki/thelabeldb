var dbPool = require('../models/common').dbPool;

function getRegID(to_id, callback) {
    var sql_select_regId = 'select registrationID from user where id = ? ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_regId, [to_id], function(err, results){
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

function get_authority_user(label_id, callback) {
    var sql = 'SELECT l.id, lm.user_id, u.nickname, u.imagepath, l.authority_user_id ' +
    'FROM label l join label_member lm on (lm.label_id = l.id) ' +
    'join user u on (u.id = lm.user_id) ' +
    'where label_id = ?';

    dbPool.getConnection(function (err, dbConn) {
       if(err) {
           return callback (err);
       }
       dbConn.query(sql, [label_id], function (err, results) {
          dbConn.release();
           if (err) {
              return callback (err);
          }
          callback(null, results);
       });
    });
}

function insertAlarm(from_id, to_id, label_id, type, callback) {

    var sql_insert_message = 'INSERT INTO `thelabeldb`.`alarm` (`from_id`, `to_id`, `label_id`, `type`) VALUES (?, ?, ?, ?) ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_insert_message, [from_id, to_id, label_id, type], function (err, result) {
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

function findMessage(from_id, label_id, callback) {
    var sql = 'select from_id, to_id, label_id, type from alarm where from_id = ? and label_id = ?';

    dbPool.getConnection(function (err, dbConn) {
       if (err) {
           return callback (err);
       }
     dbConn.query(sql, [from_id, label_id], function (err, results) {
         if(err) {
             return callback (err);
         }
         callback(null, results);
     });
    });
}

function decision(type, from_id, label_id, callback) {
    var sql_put = 'UPDATE `thelabeldb`.`alarm` SET `type`= ? WHERE `from_id`= ? and label_id = ?';

    var sql_refuse = 'DELETE FROM `thelabeldb`.`alarm` WHERE `from_id` = ? and `label_id` = ?';

    dbPool.getConnection(function (err, dbConn) {
        if(err) {
            return callback(err);
        }
        dbConn.beginTransaction(function (err) {
            if (err) {
                dbConn.release();
                return callback(err);
            } else {
                dbConn.query(sql_put, [type, from_id, label_id], function (err, result) {
                    if (err) {
                        return dbConn.rollback(function () {
                            dbConn.release();
                            callback(err);
                        });
                    } else {
                        dbConn.commit(function () {
                            dbConn.release();
                            callback(null);
                        });
                    }
                });
            }
        });
    })
}

function labelJoin(from_id, label_id, callback) {
    var sql_join = 'INSERT INTO `thelabeldb`.`label_member` (`user_id`, `label_id`) VALUES (?, ?)';

    dbPool.getConnection(function (err, dbConn) {
        if(err) {
            return callback(err);
        }
        dbConn.beginTransaction(function (err) {
            if (err) {
                dbConn.release();
                return callback(err);
            } else {
                dbConn.query(sql_join, [from_id, label_id], function (err, result) {
                    if (err) {
                        return dbConn.rollback(function () {
                            dbConn.release();
                            callback(err);
                        });
                    } else {
                        dbConn.commit(function () {
                            dbConn.release();
                            callback(null);
                        });
                    }
                });
            }
        });
    })
}

function refuse(from_id, label_id, type,  callback) {
    var sql_refuse = 'DELETE FROM `thelabeldb`.`alarm` WHERE `from_id` = ? and `label_id` = ? and `type` = ?';

    dbPool.getConnection(function (err, dbConn) {
        if(err) {
            return callback(err);
        }
        dbConn.beginTransaction(function (err) {
            if (err) {
                dbConn.release();
                return callback(err);
            } else {
                dbConn.query(sql_refuse, [from_id, label_id, type], function (err, result) {
                    if (err) {
                        return dbConn.rollback(function () {
                            dbConn.release();
                            callback(err);
                        });
                    } else {
                        dbConn.commit(function () {
                            dbConn.release();
                            callback(null);
                        });
                    }
                });
            }
        });
    })
}

module.exports.insertAlarm = insertAlarm;
module.exports.getRegID = getRegID;
module.exports.findMessage = findMessage;
module.exports.decision = decision;
module.exports.labelJoin = labelJoin;
module.exports.refuse= refuse;
module.exports.get_authority_user = get_authority_user;