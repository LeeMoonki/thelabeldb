var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;

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

function postLabelInfo(userId, callback) {
    var sql_select_labels = 'select label_id ' +
                            'from label_member ' +
                            'where user_id = ?';
    
    var label_ids = [];
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_labels, [userId], function(err, results){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    async.each(results, function(item, done){
                        
                        label_ids.push(item.label_id);
                        done(null);
                        
                    }, function(err){
                        if (err) {
                            return callback(err);
                        } else {
                            callback(null, label_ids);
                        }
                    });
                }
            });
        }
    });
}


module.exports.dummyShowPosts = dummyShowPosts;
module.exports.dummyUploadPost = dummyUploadPost;

module.exports.homePost = homePost;
module.exports.postLabelInfo = postLabelInfo;
