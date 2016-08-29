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

    var meet_sql = 'select p.id pid, u.id uid, u.nickname, p.filetype, p.ctime, p.numlike, u.position_id ' +
        'from user u join post p on (p.user_id = u.id) ' +
        'where p.opento = 0 and p.filetype = 0 and u.position_id = ? ' +
        'ORDER by p.id desc ' +
        'limit ?, ?';

    var data_sql = 'select p.id pid, u.id uid, u.nickname, p.filetype, p.ctime, p.numlike, u.position_id ' +
        'from user u join post p on (p.user_id = u.id) ' +
        'where p.opento = 0 and p.filetype = 0 ' +
        'ORDER by p.id desc' +
        'limit ?, ?';


        dbPool.getConnection(function (err, dbConn) {
            if (err) {
                return callback(err);
            }
        async.waterfall([a, b], function (err) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            var position = [];
            var list = [];

            var home = {};
            home.page = page;
            home.count = rowCount;
            home.meet = meet;

            var meet_data = [];
            var post = {};
            for (var i = 0; i < result.length; i++) {
                post.id = position[i].post_Id;
                post.user_id = position[i].user_id;
                post.nickname = position[i].user_nickname;
                post.filetype = position[i].post_filetype;
                post.file_path = position[i].post_file_path;
                post.date = position[i].post_ctime;
                post.numlike = position[i].post_numlike;
            }
            meet_data.push(post);

            var normal_data = [];
            var normal_post = {};
            for (var i = 0; i < result.length; i++) {
                normal_post.id = list[i].post_Id;
                normal_post.user_id = list[i].user_id;
                normal_post.nickname = list[i].user_nickname;
                normal_post.filetype = list[i].post_filetype;
                normal_post.file_path = list[i].post_file_path;
                normal_post.date = list[i].post_ctime;
                normal_post.numlike = list[i].post_numlike;
            }
            normal_data.push(normal_post);

            home.meetdata = meet_data;
            home.data = normal_data;
            callbaack(null, home);
        });

        function a(callback) {
            dbConn.query(meet_sql, [id, (page - 1) * meet, meet], function (err, result) {
                if (err) {
                    return callback(err);
                }
                else {
                    position = result;
                    callback(null, true);
                }
            });
        }

        function b(flag, callback) {
            dbConn.query(data_sql, [(page - 1) * rowCount, rowCount], function (err, result) {
                if (err) {
                    return callback(err);
                }
                else {
                    list = result;
                    callback(null);
                }
            });
        }
    });
}



module.exports.dummyShowPosts = dummyShowPosts;
module.exports.dummyUploadPost = dummyUploadPost;

module.exports.homePost = homePost;
