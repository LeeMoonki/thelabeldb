var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url = require('url');
var fs = require('fs');
var mime = require('mime');


var dbPool = require('../models/common').dbPool;
var hostAddress = require('../models/common').hostAddress;
var readRangeHeader = require('../models/common').readRangeHeader;


// dummy data

var dummyMeetPosts = [];
var dummyPosts = [];

dummyMeetPosts.push({
    id: 2,
    label_id: 1,
    nickname: '닉네임1',
    filetype: 0,
    file_path: '/usr/desktop/qwedfd.mp3',
    date: '2016-07-03',
    like: 5
});
dummyMeetPosts.push({
    id: 3,
    label_id: 7,
    nickname: '닉네임3',
    filetype: 0,
    file_path: '/usr/desktop/didimdol.mp3',
    date: '2016-06-23',
    like: 34
});
dummyMeetPosts.push({
    id: 9,
    label_id: 2,
    nickname: '닉네임2',
    filetype: 0,
    file_path: '/usr/desktop/lake.mp3',
    date: '2016-08-11',
    like: 9
});


dummyPosts.push({
    id: 11,
    label_id: 1,
    nickname: '닉네임8',
    filetype: 1,
    file_path: '/usr/desktop/didimdol2.jpg',
    date: '2016-08-23',
    like: 3
});
dummyPosts.push({
    id: 4,
    label_id: 1,
    nickname: '닉네임4',
    filetype: 0,
    file_path: '/usr/desktop/didimdol2.mp3',
    date: '2016-08-23',
    like: 3
});
dummyPosts.push({
    id: 17,
    label_id: 1,
    nickname: '닉네임11',
    filetype: 0,
    file_path: '/usr/desktop/didimdol2.mp3',
    date: '2016-08-23',
    like: 3
});
dummyPosts.push({
    id: 19,
    label_id: 1,
    nickname: '닉네임10',
    filetype: 0,
    file_path: '/usr/desktop/didimdol2.mp3',
    date: '2016-08-23',
    like: 3
});


function dummyShowPosts(page, count, meet, callback) {

    var meetdata = [];
    var data = [];

    for (var i = 0; i < meet; i++) {
        meetdata.push(dummyMeetPosts[i]);
    }
    data = dummyPosts;
    callback(null, meetdata, data);
}

function dummyUploadPost(postInfo, callback) {
    dummyPosts.push({
        id: 100,
        user_id: postInfo.id,
        nickname: postInfo.nickname,
        filetype: postInfo.filetype,
        file_path: postInfo.file_path,
        date: '2016-08-24',
        like: 0
    });
    callback(null, true);
}

function homePost(id, page, rowCount, meet, callback) {

    var meet_sql =
        'select p.id post_id, u.id user_id, u.nickname nickname, p.filetype filetype, p.filepath file_path, date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, p.numlike numlike ' +
        'from post p join user u on (p.user_id = u.id) ' +
        'where p.opento =0 and p.filetype = 0 and u.position_id = ? ' +
        'order by p.id desc ' +
        'limit ?;';


    var data_sql =
        'select p.id post_id, u.id user_id, u.nickname nickname, p.filetype filetype, p.filepath file_path, date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, p.numlike numlike ' +
        'from post p join user u on (p.user_id = u.id) ' +
        'where p.opento =1 and p.filetype = 0 ' +
        'order by p.id desc ' +
        'limit ?, ?;';

    var home = {};

    var meetList = [];
    var list = [];


    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        async.waterfall([a, b], function (err) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            home.page = page;
            home.count = rowCount;
            home.meet = meet;

            var meetData = {};
            var meetArray = [];
            for (var i = 0; i < meetList.length; i++) {
                // meetData.id = meetList[i].post_id;
                // meetData.user_id = meetList[i].user_id;
                // meetData.nickname = meetList[i].nickname;
                // meetData.filetype = meetList[i].filetype;
                // meetData.file_path = meetList[i].file_path;
                // meetData.date = meetList[i].ctime;
                // meetData.numlike = meetList[i].numlike;

                meetArray.push(meetList[i]);

                // meetArray.push(meetData);

            }

            var normalData = {};
            var normal = [];
            for (var i = 0; i < list.length; i++) {
                // normalData.id = list[i].position_id;
                // normalData.user_id = list[i].user_id;
                // normalData.nickname = list[i].nickname;
                // normalData.filetype = list[i].filetype;
                // normalData.file_path = list[i].file_path;
                // normalData.date = list[i].post_ctime;
                // normalData.numlike = list[i].post_numlike;

                normal.push(list[i]);

                // normal.push(normalData);
            }
            home.meetdata = meetArray;
            home.data = normal;

            callback(null, home);
        });

        function a(callback) {
            dbConn.query(meet_sql, [id, meet], function (err, result) {
                if (err) {
                    return callback(err);
                }
                else {
                    meetList = result;
                    callback(null, true);
                }
            });
        }

        function b(flag, callback) {
            dbConn.query(data_sql, [(page - 1) * rowCount, rowCount], function (err, results) {
                if (err) {
                    return callback(err);
                }
                else {
                    list = results;
                    callback(null);
                }
            });
        }
    });
}


function showHomePosts(info, callback){

    var meetPosts = [];
    var generalPosts = [];

    var sql_select_meet_posts = 'select p.id id, u.id user_id, nickname, filetype, filepath file_path, ' +
                                       'date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, ' +
                                       'numlike ' +
                                'from user u join post p on(u.id = p.user_id) ' +
                                'where u.position_id = ? and p.opento = 0 and u.id not in (?) ' +
                                'order by p.id desc ' +
                                'limit ?';

    var sql_select_general_posts = 'select p.id id, u.id user_id, nickname, filetype, filepath file_path, ' +
                                          'date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, ' +
                                          'numlike ' +
                                   'from user u join post p on(u.id = p.user_id) ' +
                                   'where p.opento = 0 and u.id not in (?) ' +
                                   'order by p.id desc ' +
                                   'limit ?,?';


    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            async.waterfall([makeMeetPosts, makeGeneralPosts], function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.release();
                    var shootResult = {};

                    shootResult.page = info.page;
                    shootResult.count = info.count;
                    shootResult.meet = info.meet;
                    shootResult.meetdata = meetPosts;
                    shootResult.data = generalPosts;

                    callback(null, shootResult);
                }
            });


            function makeMeetPosts(callback) {
                dbConn.query(sql_select_meet_posts, [info.position_id, info.user_id, info.meet], function(err, results){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(results, function(row, done){
                            var tmpObj = {};
                            var filename = path.basename(row.file_path);
                            tmpObj.id = row.id;
                            tmpObj.user_id = row.user_id;
                            tmpObj.nickname = row.nickname;
                            tmpObj.filetype = row.filetype;
                            if (parseInt(row.filetype) === 2) {
                                tmpObj.file_path = row.file_path;
                            } else if (parseInt(row.filetype) === 0) {
                                tmpObj.file_path = url.resolve(hostAddress, '/avs/' + filename);
                            } else {
                                tmpObj.file_path = url.resolve(hostAddress, '/postFiles/' + filename);
                            }
                            tmpObj.date = row.date;
                            tmpObj.numlike = row.numlike;
                            meetPosts.push(tmpObj);
                            done(null);
                        }, function(err){
                            // done
                            if (err) {
                                // done(err) 발생하지 않는다
                            } else {
                                callback(null);
                            }
                        });
                    }
                });
            }

            function makeGeneralPosts(callback) {
                dbConn.query(sql_select_general_posts, [info.user_id, (info.page - 1) * info.count, info.count]
                  , function(err, results){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(results, function(row, done){
                            var tmpObj = {};
                            var filename = path.basename(row.file_path);
                            tmpObj.id = row.id;
                            tmpObj.user_id = row.user_id;
                            tmpObj.nickname = row.nickname;
                            tmpObj.filetype = row.filetype;
                            if (parseInt(row.filetype) === 2) {
                                tmpObj.file_path = row.file_path;
                            } else if (parseInt(row.filetype) === 0) {
                                tmpObj.file_path = url.resolve(hostAddress, '/avs/' + filename);
                            } else {
                                tmpObj.file_path = url.resolve(hostAddress, '/postFiles/' + filename);
                            }
                            tmpObj.date = row.date;
                            tmpObj.numlike = row.numlike;
                            generalPosts.push(tmpObj);
                            done(null);
                        }, function(err){
                            // done
                            if (err) {
                                // done(err) 발생하지 않는다
                            } else {
                                callback(null);
                            }
                        });
                    }
                });
            }
        }
    });
}

function getAPostInfo(postId, callback) {
    
    var sql_select_a_post = 'select text, opento from post where id = ? ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_a_post, [postId], function(err, results){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, results[0]);
                }
            });
        }
    });
}

function updatePost(info, callback) {
    
    var sql_update_post = 'UPDATE `thelabeldb`.`post` SET `text`=?, `opento`=? WHERE `id`=? ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_update_post, [info.text, info.opento, info.post_id]
                      ,function(err, result){

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
    });
}

function postUpload(post, callback) {

    var sql_insert_post = 'INSERT INTO `thelabeldb`.`post` (`user_id`, `text`, `opento`, `label_id`, `filetitle`, `filepath`, `filetype`) ' +
                          'VALUES (?, ?, ?, ?, ?, ?, ?)';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.beginTransaction(function (err) {
            if (err) {
                return callback(err);
                dbConn.release();
            }
            dbConn.query(sql_insert_post, [post.user_id, post.text, post.opento, post.label_id
                , post.filetitle, post.filepath, post.filetype], function (err, result) {
                if (err) {
                    return dbConn.rollback(function(){
                        dbConn.release();
                        callback(err);
                    });
                }
                dbConn.commit(function(){
                    dbConn.release();
                    callback (null, result.insertId);
                });
            });
        })
    });
}

module.exports.dummyShowPosts = dummyShowPosts;
module.exports.dummyUploadPost = dummyUploadPost;

module.exports.homePost = homePost;
module.exports.postUpload = postUpload;

module.exports.getAPostInfo = getAPostInfo;
module.exports.updatePost = updatePost;
module.exports.showHomePosts = showHomePosts;