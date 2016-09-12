
var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url  = require('url');
var dbPool = require('../models/common').dbPool;
var hostAddress = require('../models/common').hostAddress;


function myLikePosts(userId, page, count, callback) {
  var sql_select_like_posts = 'select p.id id, p.user_id user_id, nickname, u.imagepath imagepath, filetype, filepath file_path, ' +
                                     'date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, ' +
                                     'numlike ' +
                              'from post_like l join post p on(l.post_id = p.id) ' +
                                               'join user u on(p.user_id = u.id) ' +
                              'where l.user_id = ? and p.opento not in ("2") ' +
                              'order by p.id desc ' +
                              'limit ?, ?';


  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      var shootResult = {};
      var shootPosts = [];
      dbConn.query(sql_select_like_posts, [userId, (page - 1) * count, count], function(err, results){
        dbConn.release();
        if (err) {
          return callback(err);
        } else {

          async.each(results, function(row, done){
            var tmpObj = {};
            var filename = path.basename(row.file_path);
            var profileImageName = path.basename(row.imagepath);
            tmpObj.id = row.id;
            tmpObj.user_id = row.user_id;
            tmpObj.nickname = row.nickname;
            tmpObj.imagepath = url.resolve(hostAddress, '/userProfiles/' + profileImageName);
            tmpObj.filetype = row.filetype;
            if (parseInt(row.filetype) === 2) {
              tmpObj.fileCode = path.basename(row.file_path);
              tmpObj.filepath = row.file_path;
            } else if (parseInt(row.filetype) === 0) {
              tmpObj.filepath = url.resolve(hostAddress, '/avs/' + filename);
            } else {
              tmpObj.filepath = url.resolve(hostAddress, '/postFiles/' + filename);
            }
            tmpObj.date = row.date;
            tmpObj.numlike = row.numlike;
            shootPosts.push(tmpObj);
            done(null);
          }, function(err){
            // done
            if (err) {
              // done(err) 발생하지 않음
            } else {
              shootResult.page = page;
              shootResult.count = count;
              shootResult.post = shootPosts;
              callback(null, shootResult);
            }
          });

        }
      });

    }
  });

}


function insertLike(userId, targetId, type, callback) {

  // type 0 : post's numlike
  // type 1 : label's numlike

  if (type === 0) {
    var sql_insert_like = 'INSERT INTO `thelabeldb`.`post_like` (`user_id`, `post_id`) VALUES (?, ?) ';
    var sql_select_numlike = 'select numlike from post where id = ? ';
    var sql_update_numlike = 'UPDATE `thelabeldb`.`post` SET `numlike`=? WHERE `id`=? ';
  } else {
    var sql_insert_like = 'INSERT INTO `thelabeldb`.`label_like` (`user_id`, `label_id`) VALUES (?, ?) ';
    var sql_select_numlike = 'select numlike from label where id = ? ';
    var sql_update_numlike = 'UPDATE `thelabeldb`.`label` SET `numlike`=? WHERE `id`=? ';
  }

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {

      dbConn.beginTransaction(function(err){
        if (err) {
          dbConn.release();
          return callback(err);
        } else {
          async.waterfall([innerInsertLike, increaseLike], function(err){
            if (err) {
              return dbConn.rollback(function(){
                dbConn.release();
                callback(err);
              });
            } else {
              dbConn.commit(function(){
                dbConn.release();
                callback(null);
              });
            }
          });
        }
      });
    }

    function innerInsertLike(callback) {
      dbConn.query(sql_insert_like, [userId, targetId], function(err, result){
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }

    function increaseLike(callback) {

      dbConn.query(sql_select_numlike, [targetId], function(err, result){
        if (err) {
          callback(err);
        } else {

          var newNumlike = parseInt(result[0].numlike) + 1;

          dbConn.query(sql_update_numlike, [newNumlike, targetId], function(err, result){
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          });
        }
      });

    }
  });
}

function deleteLike(userId, targetId, type, callback) {

  // type 0 : post's numlike
  // type 1 : label's numlike

  if (type === 0) {
    var sql_select_numlike = 'select numlike from post where id = ? ';
    var sql_update_numlike = 'UPDATE `thelabeldb`.`post` SET `numlike`=? WHERE `id`=? ';
    var sql_select_like_id = 'select id from post_like where user_id = ? and post_id = ? ';
    var sql_delete_like = 'DELETE FROM `thelabeldb`.`post_like` WHERE `id`=? ';
  } else {
    var sql_select_numlike = 'select numlike from label where id = ? ';
    var sql_update_numlike = 'UPDATE `thelabeldb`.`label` SET `numlike`=? WHERE `id`=? ';
    var sql_select_like_id = 'select id from label_like where user_id = ? and label_id = ? ';
    var sql_delete_like = 'DELETE FROM `thelabeldb`.`label_like` WHERE `id`=? ';
  }

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {

      dbConn.beginTransaction(function(err){
        if (err) {
          dbConn.release();
          return callback(err);
        } else {
          async.waterfall([decreaseLike, innerDeleteLike], function(err){
            if (err) {
              return dbConn.rollback(function(){
                dbConn.release();
                callback(err);
              });
            } else {
              dbConn.commit(function(){
                dbConn.release();
                callback(null);
              });
            }
          });
        }
      });
      
    }


    function decreaseLike(callback) {
      dbConn.query(sql_select_numlike, [targetId], function(err, result){
        if (err) {
          callback(err);
        } else {
          var oldNumlike = parseInt(result[0].numlike);

          if (oldNumlike <= 0) {
            callback(null);
          } else {
            var newNumlike = parseInt(result[0].numlike) - 1;
            dbConn.query(sql_update_numlike, [newNumlike, targetId], function(err, result){
              if (err) {
                callback(err);
              } else {
                callback(null);
              }
            });
          }
        }
      });
    }

    function innerDeleteLike(callback) {
      dbConn.query(sql_select_like_id, [userId, targetId], function(err, results){
        if (err) {
          callback(err);
        } else {

          var likeId = results[0].id;
          dbConn.query(sql_delete_like, [likeId], function(err, result){
            if (err) {
              callback(err);
            } else {
              callback(null);
            }
          });

        }
      });
    }

  });

}


module.exports.insertLike = insertLike;
module.exports.deleteLike = deleteLike;
module.exports.myLikePosts = myLikePosts;