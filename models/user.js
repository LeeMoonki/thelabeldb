// query Box
var queryBox = {
    g: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? ' +
    'limit ?,? ',
    p: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.position_id = ? ' +
    'limit ?,? ',
    c: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.city_id = ? ' +
    'limit ?,? ',
    t: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.town_id = ? ' +
    'limit ?,? ',
    gp: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.position_id = ? ' +
    'limit ?,? ',
    gc: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.city_id = ? ' +
    'limit ?,? ',
    gt: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    pc: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.position_id = ? and u.city_id = ? ' +
    'limit ?,? ',
    pt: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.position_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    ct: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.city_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    gpc: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.position_id = ? and u.city_id = ? ' +
    'limit ?,? ',
    gct: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.city_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    gpt: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.position_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    pct: 'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.position_id = ? and u.city_id = ? and u.town_id = ? ' +
    'limit ?,? ',
    gpct:'select u.id id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town, need ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.genre_id = ? and u.position_id = ? and u.city_id = ? and u.town_id = ? ' +
    'limit ?,? '
};
// query Box



var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;
var hostAddress = require('../models/common').hostAddress;


// using in Localstrategy in auth
function findByEmail(email, callback) {
    var sql_search_by_email = 'select id, email, nickname, gender, text, imagepath, need, ' +
        'position_id, genre_id, city_id, town_id, password ' +
        'from user ' +
        'where email = ?';

    var user = {};

    if (email === undefined) {
        return callback(null, null);
    }
    else {
        dbPool.getConnection(function (err, dbConn) {
            if (err) {
                return callback(err);
            } else {
                dbConn.query(sql_search_by_email, [email], function (err, result) {
                    dbConn.release();
                    if (err) {
                        return callback(err);
                    } else {
                        if (result[0] === undefined) {
                            // no such email
                            callback(new Error('there is no user have such email'));
                        } else {
                            user.id = result[0].id;
                            user.email = result[0].email;
                            user.nickname = result[0].nickname;
                            user.gender = result[0].gender;
                            user.text = result[0].text;
                            user.imagepath = result[0].imagepath;
                            user.position_id = result[0].position_id;
                            user.genre_id = result[0].genre_id;
                            user.city_id = result[0].city_id;
                            user.town_id = result[0].town_id;
                            user.need = result[0].need;
                            user.password = result[0].password;
                            callback(null, user);
                        }
                    }
                });
            }
        });
    }
}

// using in Localstrategy of auth
function verifyPassword(typedPassword, storedPassword, callback) {


    var sql_make_sha2 = 'select sha2(?, 512) password';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_make_sha2, [typedPassword], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    if (result[0].password === storedPassword) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                }
            });
        }
    });
}

// using in deserialize of auth 
function findUser(userId, callback) {
    var sql_search_by_userId = 'select id, email, nickname, gender, text, need, ' +
        'imagepath, position_id, genre_id, city_id, town_id ' +
        'from user ' +
        'where id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_search_by_userId, [userId], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var user = {};
                    user.id = result[0].id;
                    user.email = result[0].email;
                    user.nickname = result[0].nickname;
                    user.gender = result[0].gender;
                    user.text = result[0].text;
                    user.imagepath = result[0].imagepath;
                    user.position_id = result[0].position_id;
                    user.genre_id = result[0].genre_id;
                    user.city_id = result[0].city_id;
                    user.town_id = result[0].town_id;
                    callback(null, user);
                }
            });
        }
    });
}


// used in users's get route
function showMe(userId, page, count, callback) {
    // userId 를 받아서 해당 사용자의 정보를 전달한다

    var sql_user_info = 'select u.id id, nickname, need, imagepath image_path, g.name genre ' +
        'from user u join genre g on (u.genre_id = g.id) ' +
        'where u.id = ?';
    var sql_posts = 'select p.id, filetype, filepath, ' +
                           'date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, ' +
                           'numlike, u.nickname nickname, u.imagepath imagepath ' +
                    'from post p join user u on(p.user_id = u.id) ' +
                    'where user_id = ? ' +
                    'order by p.id desc ' +
                    'limit ?, ?';
    var sql_count_posts = 'select count(id) count from post where user_id = ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        async.waterfall([showMeGetPosts, showMeGetUser], function (err, user) {
            dbConn.release();
            if (err) {
                return callback(err);
            } else {
                callback(null, user);
            }
        });

        function showMeGetPosts(callback) {
            // post 중 userId를 갖는 사용자가 올린 게시글
            dbConn.query(sql_posts, [userId, (page - 1) * count, count], function (err, results) {
                if (err) {
                    return callback(err);
                } else {
                    var postsArr = [];
                    async.each(results, function (row, done) {
                        var tmpObj = {};
                        var filename = path.basename(row.filepath);
                        var profileImageName = path.basename(row.imagepath);
                        tmpObj.id = row.id;
                        tmpObj.nickname = row.nickname;
                        tmpObj.imagepath = url.resolve(hostAddress, '/userProfiles/' + profileImageName);
                        tmpObj.filetype = row.filetype;
                        if (parseInt(row.filetype) === 2) {
                            tmpObj.fileCode = path.basename(row.filepath);
                            tmpObj.filepath = row.filepath;
                        } else if (parseInt(row.filetype) === 0) {
                            tmpObj.filepath = url.resolve(hostAddress, '/avs/' + filename);
                        } else {
                            tmpObj.filepath = url.resolve(hostAddress, '/postFiles/' + filename);
                        }
                        tmpObj.date = row.date;
                        tmpObj.numlike = row.numlike;
                        postsArr.push(tmpObj);
                        done(null);
                    }, function (err) {
                        // done
                        if (err) {
                            // done(err) 발생하지 않는다
                        } else {
                            callback(null, postsArr);
                        }
                    });
                }
            });
        }

        function showMeGetUser(posts, callback) {
            // userId를 갖는 사용자의 정보
            dbConn.query(sql_user_info, [userId], function (err, results) {
                if (err) {
                    return callback(err);
                } else {
                    var result = {};
                    var user = {};
                    var filename = path.basename(results[0].image_path);
                    result.page = page;
                    result.count = count;

                    user.id = results[0].id;
                    user.nickname = results[0].nickname;
                    user.imagepath = url.resolve(hostAddress, '/userProfiles/' + filename);
                    user.genre = results[0].genre;

                    dbConn.query(sql_count_posts, [userId], function(err, counts){
                        if (err) {
                            return callback(err);
                        } else {
                            user.post_count = counts[0].count;
                            user.need = results[0].need;

                            result.user = user;
                            result.post = posts;

                            callback(null, result);
                        }
                    });

                }
            });
        }
    });
}

function userPage(id, page, rowCount, callback) {
    // id 라는 사용자 id를 갖는 사용자의 정보를 전달
    var sql_member = 'select u.id id, u.nickname nickname, need, u.imagepath imagepath, g.name genre, lm.label_id label_id, ' +
                            'p.name position, c.name city, t.name town ' +
                     'from user u left join label_member lm on (lm.user_id = u.id)' +
                                      'join genre g on(u.genre_id = g.id) ' +
                                      'join position p on(u.position_id = p.id) ' +
                                      'join city c on(u.city_id = c.id) ' +
                                      'join town t on(u.town_id = t.id) ' +
                     'where u.id = ?';

    var sql_posts = 'select p.id, filetype, filepath, ' +
                           'date_format(convert_tz(p.ctime, "+00:00", "+09:00"), "%Y-%m-%d %H:%i:%s") date, ' +
                           'numlike, u.nickname nickname, u.imagepath imagepath ' +
                    'from post p join user u on(p.user_id = u.id) ' +
                    'where user_id = ? ' +
                    'order by p.id desc ' +
                    'limit ?, ?';
    var sql_count_posts = 'select count(id) count from post where user_id = ? ';

    var yourpage = {};

    var member = [];
    var post = [];
    var postCount = 0;
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }

        async.waterfall([memberF, countPost, postF], function (err) {
            dbConn.release();
            if (err) {
                return callback(err);
            }

            yourpage.page = page;
            yourpage.count = rowCount;

            var labelCount = {};
            var filename = path.basename(member[0].imagepath);
            labelCount.id = member[0].id;
            labelCount.nickname = member[0].nickname;
            labelCount.genre = member[0].genre;
            labelCount.position = member[0].position;
            labelCount.city = member[0].city;
            labelCount.town = member[0].town;
            labelCount.image_path = url.resolve(hostAddress, '/userProfiles/' + filename);

            var label = [];
            for (var i = 0; i < member.length; i++) {
                label.push(member[i].label_id)
            }

            if (label[0] === null) {
                labelCount.label_id = [];
            } else {
                labelCount.label_id = label;
            }

            labelCount.post_count = postCount;
            labelCount.need = member[0].need;

            yourpage.user = labelCount;
            yourpage.post = post;

            callback(null, yourpage);
        });


        function memberF(callback) {
            dbConn.query(sql_member, [id], function (err, results) {
                if (err) {
                    return callback(err);
                }
                else {
                    member = results;
                    callback(null);
                }
            });
        }

        function postF(callback) {
            dbConn.query(sql_posts, [id, (page - 1) * rowCount, rowCount]
                , function (err, results) {
                    if (err) {
                        callback(err);
                    } else {
                        async.each(results, function (row, done) {
                            var tmpObj = {};
                            var filename = path.basename(row.filepath);
                            tmpObj.id = row.id;
                            var profileImageName = path.basename(row.imagepath);
                            tmpObj.id = row.id;
                            tmpObj.nickname = row.nickname;
                            tmpObj.imagepath = url.resolve(hostAddress, '/userProfiles/' + profileImageName);
                            tmpObj.filetype = row.filetype;
                            if (parseInt(row.filetype) === 2) {
                                tmpObj.fileCode = path.basename(row.filepath);
                                tmpObj.filepath = row.filepath;
                            } else if (parseInt(row.filetype) === 0) {
                                tmpObj.filepath = url.resolve(hostAddress, '/avs/' + filename);
                            } else {
                                tmpObj.filepath = url.resolve(hostAddress, '/postFiles/' + filename);
                            }
                            tmpObj.date = row.date;
                            tmpObj.numlike = row.numlike;
                            post.push(tmpObj);
                            done(null);
                        }, function (err) {
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

        function countPost(callback) {
            dbConn.query(sql_count_posts, [id], function(err, counts){
                if (err) {
                    return callback(err);
                } else {
                    postCount = counts[0].count;
                    callback(null);
                }
            });
        }
    });

}

function shortUserInfo(userId, callback) {

    var sql_select_short_info = 'select nickname, imagepath from user where id = ? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_short_info, [userId], function (err, results) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var shootObj = {};
                    var tmpObj = {};
                    var filename = path.basename(results[0].imagepath);
                    tmpObj.id = userId;
                    tmpObj.nickname = results[0].nickname;
                    tmpObj.imagepath = url.resolve(hostAddress, '/userProfiles/' + filename);
                    shootObj.user = tmpObj;
                    callback(null, shootObj);
                }
            });
        }
    });


}

function showProfilePage(userId, type, callback) {
    // 사용자 정보 설정 화면에 기존의 정보를 전달
    // type 0 : id 대신 이름을 제공
    // type 1 : id를 제공
    var sql_search_by_userId = 'select email, u.id id, nickname, gender, text, need, imagepath, p.name position, ' +
        'g.name genre, c.name city, t.name town, p.id pid, g.id gid, c.id cid, t.id tid ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_search_by_userId, [userId], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {

                    var user = {};
                    var filename = path.basename(result[0].imagepath);
                    user.email = result[0].email;
                    user.id = result[0].id;
                    user.nickname = result[0].nickname;
                    user.gender = result[0].gender;
                    user.text = result[0].text;
                    user.imagepath = url.resolve(hostAddress, '/userProfiles/' + filename);
                    if (type === 0) {
                        user.position = result[0].position;
                        user.genre = result[0].genre;
                        user.city = result[0].city;
                        user.town = result[0].town;
                    } else {
                        user.dbImagePath = result[0].imagepath;
                        user.position_id = result[0].pid;
                        user.genre_id = result[0].gid;
                        user.city_id = result[0].cid;
                        user.town_id = result[0].tid;
                    }
                    user.need = result[0].need;
                    callback(null, user);
                }
            });
        }
    });
}

function emailDupCheck(email, callback) {

    var sql_count_email = 'select count(id) count from user where email=? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_count_email, [email], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result[0].count);
                }
            });
        }
    });

}

function nicknameDupCheck(nickname, callback) {
    var sql_count_nickname = 'select count(id) count from user where nickname=? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_count_nickname, [nickname], function (err, result) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result[0].count);
                }
            });
        }
    });
}

function registerUser(info, callback) {
    // 회원가입

    emailDupCheck(info.email, function (err, count) {
        if (err) {
            return callback(err);
        } else {
            if (count === 0) {
                // 중복되는 이메일이 없을 때
                nicknameDupCheck(info.nickname, function (err, count) {
                    if (err) {
                        return callback(err);
                    } else {
                        if (count === 0) {
                            // 중복되는 이메일과 닉네임이 없을 때

                            var sql_register_user = 'INSERT INTO `thelabeldb`.`user` (`email`, `password`, `nickname`, `gender`, `text`, `imagepath`, ' +
                                '`position_id`, `genre_id`, `city_id`, `town_id`) ' +
                                'VALUES (?, sha2(?, 512), ?, ?, ?, ?, ?, ?, ?, ?)';

                            dbPool.getConnection(function (err, dbConn) {
                                if (err) {
                                    return callback(err);
                                } else {

                                    dbConn.beginTransaction(function (err) {
                                        if (err) {
                                            dbConn.release();
                                            return callback(err);
                                        } else {
                                            dbConn.query(sql_register_user, [info.email, info.password, info.nickname, info.gender
                                                    , info.text, info.imagepath, info.position_id, info.genre_id, info.city_id, info.town_id]
                                                , function (err, result) {

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
                        } else {
                            // 중복되는 이메일은 없으나 닉네임이 중복일 때
                            callback(null, 0);
                        }
                    }
                });
            } else {
                // 중복되는 이메일이 있을 때
                callback(null, 0);
            }
        }
    });
}

function updateUser(info, callback) {

    var sql_update_user = 'UPDATE `thelabeldb`.`user` ' +
        'SET `nickname`=?, `gender`=?, `text`=?, `imagepath`=?, ' +
        '`position_id`=?, `genre_id`=?, `city_id`=?, `town_id`=?, `need`=? ' +
        'WHERE `id`=?';

    console.log(info);
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_update_user
                        , [info.nickname, info.gender, info.text, info.imagepath
                          , info.position_id, info.genre_id, info.city_id, info.town_id
                          , info.need, info.user_id]
                        , function (err, result) {

                            if (err) {
                                return dbConn.rollback(function () {
                                    dbConn.release();
                                    callback(err);
                                });
                            } else {
                                dbConn.commit(function () {
                                    dbConn.release();
                                    callback(null, result.changedRows);
                                });
                            }
                        });
                }
            });
        }
    });
}

function updatePassword(passInfo, callback) {
    // passInfo 를 통해 받은 정보로 비밀번호를 변경한다

    var sql_update_password = 'UPDATE `thelabeldb`.`user` SET `password`=sha2(?, 512) WHERE `id`=? ';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_update_password, [passInfo.newPass, passInfo.user_id], function (err, result) {
                        if (err) {
                            return dbConn.rollback(function () {
                                dbConn.release();
                                callback(err);
                            });
                        } else {
                            dbConn.commit(function () {
                                dbConn.release();
                                callback(null, result.changedRows);
                            });
                        }
                    });
                }
            });
        }
    });
}

function checkPassword(passInfo, callback) {
    // passInfo 를 통해 받은 정보로 비밀번호 일치여부를 전달한다
    var sql_select_match = 'select count(id) count from user ' +
        'where id = ? and password = sha2(?, 512)';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_match, [passInfo.user_id, passInfo.oldPass], function (err, results) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, results[0].count);
                }
            });
        }
    });

}


// GCM 시작

function checkRegID(userId, regID, callback) {
    // userId 를 갖는 사용자가 동일한 registrationID를 갖고 있을 경우에는 놔두고
    // 아닌 경우 새로 로그인 할 때 받은 registrationID 로 바꿔주는 모듈

    var sql_select_regID = 'select registrationID from user where id = ? ';
    var sql_update_regID = 'UPDATE `thelabeldb`.`user` SET `registrationID`=? WHERE `id`=? ';
    
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    async.waterfall([checkSameRegID, updateRegID], function(err){
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
            
            function checkSameRegID(callback) {
                dbConn.query(sql_select_regID, [userId], function(err, results){
                    if (err) {
                        return callback(err)
                    } else {
                        if (results[0].registrationID === regID) {
                            // 같을 경우 update 실행하지 않는다
                            callback(null, false);
                        } else {
                            // 다를 경우 update 실행
                            callback(null, true);
                        }
                    }
                });
            }
            
            function updateRegID(flag, callback) {
                if (flag) {
                    // 다를 경우
                    dbConn.query(sql_update_regID, [regID, userId], function(err, result){
                        if (err) {
                            return callback(err);
                        } else {
                            callback(null);
                        }
                    });
                } else {
                    // 같을 경우
                    callback(null);
                }
            }
            
        }
    });
}

// GCM 끝

// User 검색 시작
// 특정 유저가 속한 레이블 목록을 검색
function getBelongLabel(userId, callback) {
    var sql_select_labels = 'select label_id ' +
        'from label_member ' +
        'where user_id = ?';


    var label_ids = [];
    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_labels, [userId], function (err, results) {
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {

                    async.each(results, function (item, done) {
                        label_ids.push(item.label_id);
                        done(null);
                    }, function (err) {
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

function searchUserFilter(page, count, info, callback) {

    getSelected(info, function(valueArr, sql_query){
        
        dbPool.getConnection(function(err, dbConn){
            if (err) {
                return callback(err);
            } else {
                dbConn.query(queryBox[sql_query], valueArr, function(err, results){
                    dbConn.release();
                    callback(null, results);
                });
            }
        });
    });

    function getSelected(gpct, callback) {
        var tmpArr = [];
        var tmpStr = '';
        if (gpct.g !== 0) {
            tmpArr.push(info.g);
            tmpStr = tmpStr + 'g';
        }
        if (gpct.p !== 0) {
            tmpArr.push(info.p);
            tmpStr = tmpStr + 'p';
        }
        if (gpct.c !== 0) {
            tmpArr.push(info.c);
            tmpStr = tmpStr + 'c';
        }
        if (gpct.t !== 0) {
            tmpArr.push(info.t);
            tmpStr = tmpStr + 't';
        }
        tmpArr.push((page - 1) * count);
        tmpArr.push(count);
        callback(tmpArr, tmpStr);
    }
}

function searchUsersByUser(userId, page, count, info, callback) {

    // 이미 검색된 사용자를 검색 결과에서 지우기 위해
    var alreadySearchedIndex = [];
    alreadySearchedIndex.push(userId);

    var maxCount = page * count; // 이번 검색으로 뽑아야할 검색 개수
    var totalResults = []; // 검색 결과를 저장

    var sql_first_filter = 'select u.id user_id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.position_id = ? and u.genre_id = ? and u.city_id = ? and u.town_id = ? ' +
        'limit ?';

    var sql_second_filter = 'select u.id user_id, nickname,u.imagepath imagepath ,p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.position_id = ? and u.genre_id = ? ' +
        'limit ?';


    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {

            async.waterfall([firstFilter, secondFilter], function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.release();
                    var shootResult = [];
                    var startIndex = (page - 1) * count;
                    var endIndex = 0;
                    if (count < totalResults.length) {
                        endIndex = startIndex + count;
                    } else {
                        endIndex = startIndex + totalResults.length;
                    }
                    for (var i = startIndex; i < endIndex; i++) {
                        shootResult.push(totalResults[i]);
                    }
                    console.log(alreadySearchedIndex);
                    callback(null, shootResult);
                }
            });

            function firstFilter(callback) {
                dbConn.query(sql_first_filter, [info.position, info.genre, info.city, info.town, maxCount],
                    function (err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            async.each(results, function (item, done) {
                                // RowDataPacket 없애고 싶으면 여기서 객체 만들어서 한다
                                findAlreadyIndex(alreadySearchedIndex, item.user_id, function (flag) {
                                    if (!flag) {
                                        var tmp = {};
                                        var filename = path.basename(item.imagepath);
                                        tmp.user_id = item.user_id;
                                        tmp.user_nickname = item.nickname;
                                        tmp.user_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                        tmp.user_position = item.position;
                                        tmp.user_genre = item.genre;
                                        tmp.user_city = item.city;
                                        tmp.user_town = item.town;
                                        totalResults.push(tmp);
                                        alreadySearchedIndex.push(item.user_id);
                                    }
                                });
                                done(null);
                            }, function (err) {
                                // done
                                if (err) {
                                    // dnoe(err) 발생하지 않음
                                } else {
                                    if (totalResults.length < maxCount) {
                                        // 더 채워야 하는 경우
                                        callback(null, true);
                                    } else {
                                        // 더 채우지 않아도 되는 경우
                                        callback(null, false);
                                    }
                                }
                            });
                        }
                    });
            }

            function secondFilter(flag, callback) {
                if (!flag) {
                    // 그 전에 검색 결과를 다 채운 경우
                    callback(null, false);
                } else {
                    dbConn.query(sql_second_filter, [info.position, info.genre, maxCount], function (err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            async.each(results, function (item, done) {
                                findAlreadyIndex(alreadySearchedIndex, item.user_id, function (flag) {
                                    if (!flag) {
                                        var tmp = {};
                                        var filename = path.basename(item.imagepath);
                                        tmp.user_id = item.user_id;
                                        tmp.user_nickname = item.nickname;
                                        tmp.user_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                        tmp.user_position = item.position;
                                        tmp.user_genre = item.genre;
                                        tmp.user_city = item.city;
                                        tmp.user_town = item.town;
                                        totalResults.push(tmp);
                                        alreadySearchedIndex.push(item.user_id);
                                    }
                                });
                                done(null);
                            }, function (err) {
                                // done
                                if (err) {
                                    // done(err) 발생하지 않음
                                } else {
                                    if (totalResults.length < maxCount) {
                                        // 더 채워야 하는 경우
                                        callback(null, true);
                                    } else {
                                        // 더 채우지 않아도 되는 경우
                                        callback(null, false);
                                    }
                                }
                            });
                        }
                    });

                }
            }
        }
    });

}

function searchUsersByLabel(page, count, info, callback) {

    var sql_search_genre = 'select u.id user_id, nickname, u.imagepath imagepath, p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.genre_id = ? ' +
        'limit ?';

    var sql_search_position = 'select u.id user_id, nickname, u.imagepath imagepath, p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.position_id = ? ' +
        'limit ?';

    // 이미 검색된 사용자를 검색 결과에서 지우기 위해
    var alreadySearchedIndex = [];

    var maxCount = page * count; // 이번 검색으로 뽑아야할 검색 개수
    var totalResults = []; // 검색 결과를 저장

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {

            async.waterfall([genreFilter, positionFilter], function (err) {
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.release();
                    var shootResult = [];
                    var startIndex = (page - 1) * count;
                    var endIndex = 0;
                    if (count < totalResults.length) {
                        endIndex = startIndex + count;
                    } else {
                        endIndex = startIndex + totalResults.length;
                    }
                    for (var i = startIndex; i < endIndex; i++) {
                        shootResult.push(totalResults[i]);
                    }
                    callback(null, shootResult);
                }
            });

            function genreFilter(callback) {

                // 가입한 레이블들의 장르정보들을 가지고 검색을 진행
                async.each(info, function (item, done) {
                    dbConn.query(sql_search_genre, [item.genre_id, maxCount], function (err, genreResults) {
                        if (err) {
                            done(err);
                        } else {
                            // 쿼리 결과 정리 구간
                            async.each(genreResults, function (row, next) {
                                var tmp = {};
                                var filename = path.basename(row.imagepath);
                                tmp.user_id = row.user_id;
                                tmp.user_nickname = row.nickname;
                                tmp.user_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                tmp.user_position = row.position;
                                tmp.user_genre = row.genre;
                                tmp.user_city = row.city;
                                tmp.user_town = row.town;
                                totalResults.push(tmp);
                                alreadySearchedIndex.push(row.label_id);
                                next(null);
                            }, function (err) {
                                // next
                                if (err) {
                                    // next(err) 발생하지 않음
                                } else {
                                    done(null);
                                }
                            });
                        }
                    });
                }, function (err) {
                    // done
                    if (err) {
                        callback(err);
                    } else {
                        // 채운 개수에 따른 다음 필터 실행 여부
                        if (totalResults.length < maxCount) {
                            callback(null, true);
                        } else {
                            callback(null, false);
                        }
                    }
                });
            }

            function positionFilter(flag, callback) {
                if (!flag) {
                    // 그전에 검색 결과를 다 채운경우
                    callback(null, false);
                } else {
                    // 2중 each를 통한 dbConn.query필요, 집중
                    // approach first row
                    async.each(info, function (firstItem, firstDone) {
                        //approach second row
                        async.each(firstItem.position_id, function (secondItem, secondDone) {
                            // now secondItem has a position_id for query
                            dbConn.query(sql_search_position, [secondItem, maxCount], function (err, results) {
                                // need to write secondDone here
                                if (err) {
                                    secondDone(err);
                                } else {
                                    // need async.each for insert items of results to totalResuts
                                    async.each(results, function (row, done) {
                                        findAlreadyIndex(alreadySearchedIndex, row.user_id, function (flag) {
                                            if (!flag) {
                                                var tmp = {};
                                                var filename = path.basename(row.imagepath);
                                                tmp.user_id = row.user_id;
                                                tmp.user_nickname = row.nickname;
                                                tmp.user_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                                tmp.user_position = row.position;
                                                tmp.user_genre = row.genre;
                                                tmp.user_city = row.city;
                                                tmp.user_town = row.town;
                                                totalResults.push(tmp);
                                                alreadySearchedIndex.push(row.user_id);
                                            }
                                        });
                                        done(null);
                                    }, function (err) {
                                        // done
                                        if (err) {
                                            // done(err) 발생하지 않음
                                        } else {
                                            secondDone(null);
                                        }
                                    });
                                }
                            });
                        }, function (err) {
                            // secondDone
                            // need to write firstDone here
                            if (err) {
                                firstDone(err);
                            } else {
                                firstDone(null);
                            }
                        });
                    }, function (err) {
                        // firstDone
                        if (totalResults.length < maxCount) {
                            callback(null, true);
                        } else {
                            callback(null, false);
                        }
                    });
                }
            }
        }
    });
}

function findAlreadyIndex(indexArr, index, callback) {
    var length = indexArr.length;
    var flag = false;
    for (var i = 0; i < length; i++) {
        if (indexArr[i] === index) {
            flag = true;
            break;
        }
    }
    callback(flag);
}

function search_sortGenre(content, page, count, callback) {

    var sql_search = 'select u.id user_id, nickname, need, u.imagepath imagepath, p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.nickname like ? ' +
        'order by u.genre_id ' +
        'limit ?, ?;';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_search, [content, (page - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err)
            }
            var user = {};
            var userResults = [];

            user.page = page;
            user.count = count;

            async.each(results, function(item, done){
                var tmp = {};
                var filename = path.basename(item.imagepath);
                tmp.id = item.user_id;
                tmp.nickname = item.nickname;
                tmp.image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                tmp.position = item.position;
                tmp.genre = item.genre;
                tmp.city = item.city;
                tmp.town = item.town;
                tmp.need = item.need;
                userResults.push(tmp);
                done(null)
            }, function(err){
                // done
                if (err) {
                    // done(err) 발생하지 않음
                } else {
                    user.user = userResults;
                    callback(null, user);
                }
            });
        });
    });
}

function search_sortPosition(content, page, count, callback) {

    var sql_search = 'select u.id user_id, nickname, need, u.imagepath imagepath, p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.nickname like ? ' +
        'order by u.position_id desc ' +
        'limit ?, ?;';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_search, [content, (page - 1) * count, count], function (err, results) {
          dbConn.release();
            if (err) {
                return callback(err)
            }
            var user = {};
            var userResults = [];

            user.page = page;
            user.count = count;

            async.each(results, function(item, done){
                var tmp = {};
                var filename = path.basename(item.imagepath);
                tmp.id = item.user_id;
                tmp.nickname = item.nickname;
                tmp.image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                tmp.position = item.position;
                tmp.genre = item.genre;
                tmp.city = item.city;
                tmp.town = item.town;
                tmp.need = item.need;
                userResults.push(tmp);
                done(null)
            }, function(err){
                // done
                if (err) {
                    // done(err) 발생하지 않음
                } else {
                    user.user = userResults;
                    callback(null, user);
                }
            });
        });
    });
}

function search_sortCity(content, page, count, callback) {

    var sql_search = 'select u.id user_id, nickname, need, u.imagepath imagepath, p.name position, g.name genre, c.name city, t.name town ' +
        'from user u join position p on(u.position_id = p.id) ' +
        'join genre g on(u.genre_id = g.id) ' +
        'join city c on(u.city_id = c.id) ' +
        'join town t on(u.town_id = t.id) ' +
        'where u.nickname like ? ' +
        'order by u.city_id desc ' +
        'limit ?, ?;';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.query(sql_search, [content, (page - 1) * count, count], function (err, results) {
            dbConn.release();
            if (err) {
                return callback(err)
            }
            var user = {};
            var userResults = [];

            user.page = page;
            user.count = count;

            async.each(results, function(item, done){
                var tmp = {};
                var filename = path.basename(item.imagepath);
                tmp.id = item.user_id;
                tmp.nickname = item.nickname;
                tmp.image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                tmp.position = item.position;
                tmp.genre = item.genre;
                tmp.city = item.city;
                tmp.town = item.town;
                tmp.need = item.need;
                userResults.push(tmp);
                done(null)
            }, function(err){
                // done
                if (err) {
                    // done(err) 발생하지 않음
                } else {
                    user.user = userResults;
                    callback(null, user);
                }
            });
        });
    });
}

// User 검색 끝




module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findUser = findUser;

// models showing JSON data for dummy test
module.exports.showMe = showMe;
module.exports.userPage = userPage;
module.exports.emailDupCheck = emailDupCheck;
module.exports.nicknameDupCheck = nicknameDupCheck;
module.exports.registerUser = registerUser;
module.exports.showProfilePage = showProfilePage;
module.exports.updateUser = updateUser;
module.exports.updatePassword = updatePassword;
module.exports.checkPassword = checkPassword;
module.exports.searchUserFilter = searchUserFilter;
module.exports.searchUsersByUser = searchUsersByUser;
module.exports.searchUsersByLabel = searchUsersByLabel;
module.exports.checkRegID = checkRegID;
module.exports.getBelongLabel = getBelongLabel;
module.exports.shortUserInfo = shortUserInfo;

module.exports.search_sortGenre = search_sortGenre;
module.exports.search_sortPosition = search_sortPosition;
module.exports.search_sortCity = search_sortCity;