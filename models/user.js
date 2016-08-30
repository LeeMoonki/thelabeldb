//dummy data
var dummyUser = {};

dummyUser.dummy_email = 'abcd@naver.com';
dummyUser.dummy_password = '1234';
dummyUser.dummy_id = 1;
dummyUser.dummy_nickname = '닉네임';
dummyUser.dummy_gender = '남자';
dummyUser.dummy_position = '보컬';
dummyUser.dummy_genre = '발라드';
dummyUser.dummy_city = '서울';
dummyUser.dummy_town = '관악구';



var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url  = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;

// using in Localstrategy in auth
function findByEmail(email, callback) {
    var sql_search_by_email = 'select id, email, nickname, gender, text, imagepath, ' +
                                         'position_id, genre_id, city_id, town_id, password ' +
                              'from user ' +
                              'where email = ?';

    var user = {};

    if (email === undefined) {
        return callback(null, null);
    }
    else {
      dbPool.getConnection(function(err, dbConn){
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

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      dbConn.query(sql_make_sha2, [typedPassword], function(err, result){
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
function  findUser(userId, callback) {
  var sql_search_by_userId = 'select id, email, nickname, gender, text, ' +
    'imagepath, position_id, genre_id, city_id, town_id ' +
    'from user ' +
    'where id = ?';

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      dbConn.query(sql_search_by_userId, [userId], function(err, result){
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
function showMe(userId, page, count, callback){

  console.log('showMe userId : ' + userId);
  var sql_user_info = 'select u.id id, nickname, imagepath image_path, g.name genre ' +
    'from user u join genre g on (u.genre_id = g.id) ' +
    'where u.id = ?';
  var sql_posts = 'select id, filetype, filepath, ctime, numlike from post where user_id = ? limit ?, ?';

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    }
    async.waterfall([showMeGetPosts, showMeGetUser], function(err, user){
      dbConn.release();
      if (err) {
        return callback(err);
      } else {
        callback(null, user);
      }
    });

    function showMeGetPosts(callback){
      dbConn.query(sql_posts, [userId, (page - 1) * count, count], function(err, results){
        if (err) {
          return callback(err);
        } else {
          callback(null, results);
        }
      });
    }

    function showMeGetUser(posts, callback){
      dbConn.query(sql_user_info, [userId], function(err, result){
        if (err) {
          return callback(err);
        } else {
          var user = {};
          user.page = page;
          user.count = count;
          result[0].post_count = posts.length;
          user.result = result[0];
          user.data = posts;

          callback(null, user);
        }
      });
    }
  });
}



function userPage(id, page, rowCount, callback) {
  var sql_member = 'select u.id id, u.nickname nickname, u.imagepath imagepath, u.genre_id genre, lm.label_id label_id ' +
      'from user u join label_member lm on (lm.user_id = u.id) ' +
      'where user_id = ?';

  var sql_post = 'select p.id, p.filetype, p.filepath, p.ctime, p.numlike ' +
      'from user u join post p on (p.user_id = u.id) ' +
      'where user_id = ? ' +
      'limit ?, ?';

  var yourpage = {};

  var member = [];
  var post = [];
  dbPool.getConnection(function (err, dbConn) {
    if (err) {
      return callback(err);
    }

    async.waterfall([memberF, postF], function(err){
      dbConn.release();
      if (err) {
        return callback(err);
      }

      yourpage.page = page;
      yourpage.count = rowCount;

      var labelCount = {};
      labelCount.id = member[0].id;
      labelCount.nickname = member[0].nickname;
      labelCount.image_path = member[0].imagepath;
      labelCount.genre = member[0].genre;

      var label = [];
      for (var i = 0; i < member.length; i++) {
        label.push(member[i].label_id)
      }
      labelCount.label_id = label;
      labelCount.post_count = post.length;

      yourpage.result = labelCount;
      yourpage.data = post;

      callback(null, yourpage);
    });



    function memberF(callback){
      dbConn.query(sql_member, [id], function (err, result) {
        if (err) {
          return callback(err);
        }
        else {
          member = result;
          callback(null, true);
        }
      });
    }
    function postF(flag, callback){
      dbConn.query(sql_post, [id, (page - 1) * rowCount, rowCount], function (err, result) {
        if (err) {
          return callback(err);
        }
        else {
          post = result;
          callback(null);
        }
      });
    }

  });

}



function showProfilePage(userId, callback){
  var sql_search_by_userId = 'select u.id id, nickname, gender, text, imagepath, p.name position, ' +
                                    'g.name genre, c.name city, t.name town ' +
                             'from user u join position p on(u.position_id = p.id) ' +
                                         'join genre g on(u.genre_id = g.id) ' +
                                         'join city c on(u.city_id = c.id) ' +
                                         'join town t on(u.town_id = t.id) ' +
                             'where u.id = ?';

  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      dbConn.query(sql_search_by_userId, [userId], function(err, result){
        dbConn.release();
        if (err) {
          return callback(err);
        } else {
          var user = {};
          user.id = result[0].id;
          user.nickname = result[0].nickname;
          user.gender = result[0].gender;
          user.text = result[0].text;
          user.image_path = result[0].imagepath;
          user.position = result[0].position;
          user.genre = result[0].genre;
          user.city = result[0].city;
          user.town = result[0].town;
          callback(null, user);
        }
      });
    }
  });
}

function dummySearchUsers(page, count, info, callback){
  var user = [];

  user.push({
    user_id: 11,
    user_nickname: '타인1',
    user_image_path: '/usr/desktop/asdqwe.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });
  user.push({
    user_id: 8,
    user_nickname: '타인2',
    user_image_path: '/usr/desktop/love.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });
  user.push({
    user_id: 15,
    user_nickname: '타인3',
    user_image_path: '/usr/desktop/sing.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });

  callback(null, user);
}

function registerUser(info, callback){

  var sql_register_user = 'INSERT INTO `thelabeldb`.`user` (`email`, `password`, `nickname`, `gender`, `text`, `imagepath`, ' +
                                                           '`position_id`, `genre_id`, `city_id`, `town_id`) ' +
                          'VALUES (?, sha2(?, 512), ?, ?, ?, ?, ?, ?, ?, ?)';

  
  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {
      
      dbConn.beginTransaction(function(err){
        if (err) {
          return callback(err);
        } else {
          dbConn.query(sql_register_user, [info.email, info.password, info.nickname, info.gender
              , info.text, info.imagepath, info.position_id, info.genre_id, info.city_id, info.town_id]
            ,function(err, result){
              
              if (err) {
                return dbConn.rollback(function(){
                  dbConn.release();
                  callback(err);
                });
              } else {
                dbConn.commit(function(){
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

function dummyUpdateUser(user, callback){

  callback(null, true);

}

function dummyUpdatePassword(userId, password, newPassword, callback){
  // userId 를 통해 기존 password를 찾아 받은 password와 비교해야 한다
  if (dummyUser.dummy_password !== password) {
    callback(new Error('기존 비밀번호를 다르게 입력했습니다'), false);
  } else {
    dummyUser.dummy_password = newPassword;
    callback(null, true);
  }
}

module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findUser = findUser;

// models showing JSON data for dummy test
module.exports.showMe = showMe;
module.exports.userPage = userPage;
module.exports.registerUser = registerUser;
module.exports.showProfilePage = showProfilePage;
module.exports.dummyUpdateUser = dummyUpdateUser;
module.exports.dummyUpdatePassword = dummyUpdatePassword;
module.exports.dummySearchUsers = dummySearchUsers;
module.exports.dummyLabel = dummyUser;
