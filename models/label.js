//dummy function

var dummyLabel = {};
dummyLabel.id = 1;
dummyLabel.name = 'NUGA';
dummyLabel.image_path = '/usr/desktop/didimdol1.jpg';
dummyLabel.need_genre = '발라드';
dummyLabel.need_position = '보컬';

var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url  = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;

function updateLabel(info, callback){
    var label = info;
    callback(null, label);
}

function showSettingLabelPage(labelId, callback){

    var sql_select_setting_info = 'select l.name label_name, text, imagepath image_path, g.name need_genre, p.name need_position ' +
                                  'from label l join genre g on(l.genre_id = g.id) ' +
                                               'join label_need n on(l.id = n.label_id) ' +
                                               'join position p on(n.position_id = p.id) ' +
                                  'where l.id = ?';

    var sql_select_need_info = 'select p.name pname ' +
                               'from label_need n join position p on(n.position_id = p.id) ' +
                               'where label_id = ?';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_setting_info, [labelId], function(err, results){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var label = {};
                    label.label_name = results[0].label_name;
                    label.text = results[0].text;
                    label.image_path = results[0].image_path;
                    label.need_genre = results[0].need_genre;
                    dbConn.query(sql_select_need_info, [labelId], function(err, needResults){
                        if (err) {
                            return callback(err);
                        } else {
                            if (needResults[0] === undefined) {
                                label.need_positio = {};
                                callback(null, label);
                            } else {
                                var temp = [];
                                for (var i = 0; i < needResults.length; i++) {
                                    temp.push(needResults[i].pname);
                                }
                                label.need_position = temp;
                                callback(null, label);
                            }
                        }
                    });
                }
            });
        }
    });

}

function searchLabel(page, count, info, callback){

    callback(null, info);


}

function dummyRegisterLabel(label, callback) {
    callback(null, true);
}


function labelMain(labelId, page, count, callback) {
    // result block
    var sql_select_label_info = 'select l.id id, l.name name, imagepath, g.name genre ' +
                                'from label l join genre g on(l.genre_id = g.id) ' +
                                'where l.id = ?';
    var sql_select_label_need = 'select name ' +
                                'from label_need n join position p on(n.position_id = p.id) ' +
                                'where label_id = ?';

    // member block
    var sql_select_member_info = 'select user_id, nickname user_nickname, p.name user_possition, imagepath user_imagepath ' +
                                 'from user u join label_member m on(u.id = m.user_id) ' +
                                 'join position p on(u.position_id = p.id) ' +
                                 'where label_id = ?';

    // data block
    var sql_select_posts = 'select p.id id, user_id, nickname, filetype, filepath file_path, p.ctime date, numlike ' +
                           'from post p join user u on(p.user_id = u.id) ' +
                           'where p.label_id = ? ' +
                           'limit ?, ?';

    var result = {};
    var members = [];
    var data = [];

    var memberResult = [];
    var postResult = [];

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            async.waterfall([getLabelInfo, getLabelMember, getLabelPosts], function(err){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var user = {};
                    // var member = {};
                    // var post = {};
                    user.page = page;
                    user.count = count;

                    user.result = result;
                    for (var i = 0; i < memberResult.length; i++) {
                        members.push(memberResult[i]);
                    }
                    for (var j = 0; j < postResult.length; j++) {
                        data.push(postResult[j]);
                    }
                    user.member = members;
                    user.data = data;
                    callback(null, user);
                }
            });
        }

        function getLabelInfo(callback) {
            dbConn.query(sql_select_label_info, [labelId], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_label_info'));
                } else {
                    result.label_id = results[0].id;
                    result.label_name = results[0].name;
                    result.label_image_path = results[0].imagepath;
                    result.label_genre = results[0].genre;
                    dbConn.query(sql_select_label_need, [labelId], function(err, needResults){
                        if (err) {
                            callback(new Error('Error sql_select_label_need'));
                        } else {
                            var need = [];
                            for (var i = 0; i < needResults.length; i++) {
                                need.push(needResults[i].name);
                            }
                            result.label_need_position = need;
                            callback(null);
                        }
                    });
                }
            });
        }

        function getLabelMember(callback) {
            dbConn.query(sql_select_member_info, [labelId], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_member_info'));
                } else {
                    memberResult = results;
                    callback(null);
                }
            });
        }


        function getLabelPosts(callback) {
            dbConn.query(sql_select_posts, [labelId, (page - 1) * count, count], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_posts'));
                } else {
                    postResult = results;
                    callback(null);
                }
            });
        }
    });
}


function labelPage(userId, callback) {

    var sql = 'select l.id id, l.name label_name, imagepath, authority_user_id ' +
              'from label l join label_member m on(l.id = m.label_id) ' +
              'where m.user_id = ?';

    dbPool.getConnection(function (err, dbConn) {
       if (err) {
           return callback(err);
       }
       dbConn.query(sql, [userId], function (err, result) {
           dbConn.release();
          if (err) {
              return callback (err);
          }
          else {
              if (result[0] === undefined) {
                  callback(null, {});
              } else {
                  var label_list = {};
                  var label_page = [];
                  var label = {};
                  for (var i = 0; i < result.length; i++) {
                      label.id = result[i].id;
                      label.label_name = result[i].label_name;
                      label.image_path = result[i].imagepath;
                      label.authorization = result[i].authority_user_id;
                      label_page.push(label);
                  }
                  label_list.data = label_page;

                  callback(null, label_list);
              }
          }
       });
    });
}

function labelMember(label_id, callback) {
    var sql = 'select lm.user_id, u.nickname, u.imagepath ' +
    'from label l join label_member lm on (lm.label_id = l.id) ' +
    'join user u on (u.id = lm.user_id) ' +
    'where l.id = ?';

    dbPool.getConnection(function (err, dbConn) {

        if (err) {
            return callback (err);
        }
        dbConn.query(sql, [label_id], function (err, result) {
            dbConn.release();
            if (err) {
                return callback (err);
            }
            else {
                var label_member = {};
                var member =[];
                var user = {};

                user = result;

                user.user_id = result[0].user_id;
                user.user_name = result[0].user_nickname;
                user.user_image_path = result[0].user_image_path;

                member = user;
                label_member.data = member;

                callback(null, label_member);


            }
        });
    });
}

function getLabelSearchInfo(labelId, callback) {
    var sql_find_ids = 'select l.genre_id genre_id, n.position_id position_id ' +
                       'from label l join label_need n on(l.id = n.label_id) ' +
                       'where l.id = ?';
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_find_ids, [labelId], function(err, results){
                dbConn.release();
                if (err) {
                    callback(new Error('Error sql_find_ids'));
                } else {
                    var info = {};
                    var pos = [];
                    info.genre_id = results[0].genre_id;
                    for (var i = 0; i < results.length; i++) {
                        pos.push(results[i].position_id);
                    }
                    info.position_id = pos;
                    
                    callback(null, info);
                }
            });
        }
    });
}


module.exports.dummyRegisterLabel = dummyRegisterLabel;

module.exports.searchLabel = searchLabel;
module.exports.showSettingLabelPage = showSettingLabelPage;
module.exports.updateLabel = updateLabel;

module.exports.labelMain = labelMain;
module.exports.labelPage = labelPage;
module.exports.labelMember = labelMember;

module.exports.getLabelSearchInfo = getLabelSearchInfo;