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
    'where p.opento = 0 and p.filetype = 0 and u.position = ? ' +
    'order by p.id desc limit ?, ?;';

    var data_sql = 'select p.id pid, u.id uid, u.nickname, p.filetype, p.ctime, p.numlike, u.position_id ' +
    'from user u join post p on (p.user_id = u.id) ' +
    'where p.opento = 0 and p.filetype = 0 ' +
    'order by p.id desc limit ?, ?;';

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
            dbConn.query(meet_sql, [id, rowCount], function (err, result) {
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
//     var home = {};
//     var position = [];
//     // var post = {};
//     var post_data = [];
//     // var data_post = {};
//
//     dbPool.getConnection(function (err, dbConn) {
//         if (err) {
//             return callback(err);
//         }
//         async.waterfall([a, b], function (err) {
//             dbConn.release();
//             if (err) {
//                 return callback(err);
//             }
//
//             home.page = page;
//             home.count = rowCount;
//             home.meet = meet;
//
//             var post = {};
//             post.id = position[0].post_Id;
//             post.user_id = position[0].user_id;
//             post.nickname = position[0].user_nickname;
//             post.filetype = position[0].post_filetype;
//             post.file_path = position[0].post_file_path;
//             post.date = position[0].post_ctime;
//             post.numlike = position[0].post_numlike;
//
//             // meetdata.push(post);
//
//             var data_post = {};
//             data_post.id = post_data[0].post_Id;
//             data_post.user_id = post_data[0].user_id;
//             data_post.nickname = post_data[0].user_nickname;
//             data_post.filetype = post_data[0].post_filetype;
//             data_post.file_path = post_data[0].post_file_path;
//             data_post.date = post_data[0].post_ctime;
//             data_post.numlike = post_data[0].post_numlike;
//
//             home.meetdata = post;
//             home.data = data_post;
//
//             callback(null, home);
//         });
//
//         function a(callback) {
//             dbConn.query(meet_sql, [position_id], function (err, result) {
//                 //    dbConn.release();
//                 if (err) {
//                     return callback(err);
//                 }
//                 else {
//                     position = result;
//                     callback(null, true);
//                 }
//             });
//         }
//
//         function b(flag, callback) {
//             dbConn.query(data_sql, [(page - 1) * rowCount, rowCount], function (err, result) {
//                 //  dbConn.release();
//                 if (err) {
//                     return callback(err);
//                 }
//                 else {
//                     post_data = result;
//                     callback(null);
//                 }
//             });
//         }
//     });
// }

//
//
//
//
//
//
//                // data.push(data_post);
//             }
//         })
//
//         home.meetdata = meetdata;
//         home.data = data;
//     });
// }

function test(pid, page, count, callback) {
    var sql = 'select p.id, u.nickname, numlike ' +
    'from post p join user u on(p.user_id = u.id) ' +
    'where opento = 0 and filetype = 0 and u.position_id = ? ' +
    'order by id desc ' +
    'limit ?, ?;';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql, [pid, (page - 1) * count, count], function(err, results){
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        }
    });

}

module.exports.dummyShowPosts = dummyShowPosts;
module.exports.dummyUploadPost = dummyUploadPost;

module.exports.homePost = homePost;
module.exports.test = test;