//dummy function
var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url  = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;

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

function showSettingLabelPage(info, callback){
    var label = info;
    callback(null, label);
}

function searchLabel(page, count, info, callback){
    var label = [];

    label.push({
        label_id: 11,
        label_name: '타인1',
        label_image_path: '/usr/desktop/asdqwe.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });
    label.push({
        label_id: 8,
        label_name: '타인2',
        label_image_path: '/usr/desktop/love.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });
    label.push({
        label_id: 15,
        label_name: '타인3',
        label_image_path: '/usr/desktop/sing.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });

    callback(null, label);
}

function labelList(callback) {
    if (label_name === undefined) {
        return callback(null, null);
    }
    else {
        var list = {};
        label.label_name = label_name;
        callback(null, label);
    }
    callback(null, label);
}

function findLabel(name, callback) {
    var list = {};
    list.name = dummyLabel.name;
    callback(null, list);
}


function dummyRegisterLabel(label, callback) {
    callback(null, true);
}

function dummy_labelPage(id, page, count, callback) {
    var list =
    {
        id: 1,
        label_name: 'nuga',
        image_path: '/usr/desktop/didimdol1.jpg',
        authorization: 'setting'
    };
    callback(null, list)

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
                           'where p.label_id = ?';

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
            dbConn.query(sql_select_posts, [labelId], function(err, results){
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

// 레이블 구성멤버
function dummy_labelMember(callback) {
        var member =
            [
                {
                    user_id: 1,
                    user_name: '가나다',
                    image_path: '/usr/desktop/didimdol1.jpg'
                },
                {
                    user_id: 2,
                    user_name: '거너더',
                    image_path: '/usr/desktop/didimdol2.jpg'
                },
                {
                    user_id: 3,
                    user_name: '리미비',
                    image_path: '/usr/desktop/didimdol3.jpg'
                }
            ];
        callback(null, member);
}


//레이블 셋팅
// function labelSet( callback) {
//     var set =
//     callback(null );
// }

function labelPage(id, page, count, callback) {

    var sql = 'select l.id label_id, l.name label_name, l.imagepath image_path, l.authority_user_id authorization ' +
    'from user u join label l on (l.authority_user_id = u.id) ' +
    'where u.id = ?';

    dbPool.getConnection(function (err, dbConn) {
       if (err) {
           return callback(err);
       }
       dbConn.query(sql, [id], function (err, result) {
           dbConn.release();
          if (err) {
              return callback (err);
          }
          else {
              var label_list = {};
              var label_page = [];
              var label = {};

              label = result;
              label.id = result[0].label_id;
              label.label_name = result[0].label_name;
              label.image_path = result[0].label_image_path;
              label.authorization = result[0].authority_user_id;

              label_page = label;
              label_list.data = label_page;

              callback(null, label_list);
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

module.exports.labelList = labelList;
module.exports.dummyRegisterLabel = dummyRegisterLabel;
module.exports.labelMain = labelMain;
module.exports.dummyLabel = dummyLabel;
module.exports.dummy_labelPage = dummy_labelPage;
module.exports.dummy_labelMember = dummy_labelMember;
module.exports.searchLabel = searchLabel;
module.exports.showSettingLabelPage = showSettingLabelPage;
module.exports.updateLabel = updateLabel;
//module.exports.labelSet = labelSet;

module.exports.labelPage = labelPage;
module.exports.labelMember = labelMember;