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




// User 검색 시작
// 특정 유저가 속한 레이블 목록을 검색
function getBelongLabel(userId, callback) {
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

function searchUsersByUser(page, count, info, callback){

  // 이미 검색된 사용자를 검색 결과에서 지우기 위해
  var alreadySearchedIndex = [];
  
  var maxCount = page * count; // 이번 검색으로 뽑아야할 검색 개수
  var numResults = 0; // 검색하고 있는 내용의 개수를 기록
  var totalResults = []; // 검색 결과를 저장
  
  var sql_first_filter = 'select u.id user_id, nickname, p.name position, g.name genre, c.name city, t.name town ' +
  'from user u join position p on(u.position_id = p.id) ' +
  'join genre g on(u.genre_id = g.id) ' +
  'join city c on(u.city_id = c.id) ' +
  'join town t on(u.town_id = t.id) ' +
  'where u.position_id = ? and u.genre_id = ? and u.city_id = ? and u.town_id = ? ';

  var sql_second_filter = 'select u.id user_id, nickname, p.name position, g.name genre, c.name city, t.name town ' +
    'from user u join position p on(u.position_id = p.id) ' +
    'join genre g on(u.genre_id = g.id) ' +
    'join city c on(u.city_id = c.id) ' +
    'join town t on(u.town_id = t.id) ' +
    'where u.position_id = ? and u.genre_id = ? ';


  
  dbPool.getConnection(function(err, dbConn){
    if (err) {
      return callback(err);
    } else {

      async.waterfall([firstFilter, secondFilter], function(err){
        if (err) {
          dbConn.release();
          return callback(err);
        } else {
          dbConn.release();
          var shootResult = [];
          var startIndex = (page - 1) * count;
          for (var i = startIndex; i < startIndex + numResults; i++) {
            shootResult.push(totalResults[i]);
          }
          console.log(startIndex + numResults);
          console.log(shootResult);
          console.log(alreadySearchedIndex);
          callback(null, shootResult);
        }
      });

      function firstFilter(callback){
        dbConn.query(sql_first_filter, [info.position, info.genre, info.city, info.town],
          function(err, results){
            if (err) {
              callback(err);
            } else {
              numResults = numResults + results.length;
              async.each(results, function(item, done){
                // RowDataPacket 없애고 싶으면 여기서 객체 만들어서 한다
                totalResults.push(item);
                alreadySearchedIndex.push(item.user_id);
                done(null);
              }, function(err){
                // done
                if (err) {
                  // dnoe(err) 발생하지 않음
                } else {
                  if (numResults < maxCount) {
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

      function secondFilter(flag, callback){
        if (!flag) {
          // 그 전에 검색 결과를 다 채운 경우
          callback(null, false);
        } else {
          dbConn.query(sql_second_filter, [info.position, info.genre], function(err, results){
            if (err) {
              callback(err);
            } else {
              console.log(results);
              numResults = numResults + results.length;
              async.each(results, function(item, done){
                findAlreadyIndex(alreadySearchedIndex, item.user_id, function(flag){
                  if (!flag) {
                    // var tmpObj = {};
                    // tmpObj.user_id = item.user_id;
                    // tmpObj.nickname = item.nickname;
                    // tmpObj.position = item.position;
                    // tmpObj.genre = item.genre;
                    // tmpObj.city = item.city;
                    // tmpObj.town = item.town;
                    // 그전에 찾은 값이 아니라면, 즉 새로운 검색 결과
                    totalResults.push(item);
                    alreadySearchedIndex.push(item.user_id);
                  } else {
                    // 그전에 찾은 값이라면, 즉 검색했던 것을 검색한 것
                    numResults = numResults - 1;
                  }
                });
                done(null);
              }, function(err){
                // done
                if (err) {
                  // done(err) 발생하지 않음
                } else {
                  if (numResults < maxCount) {
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
  callback(null, info);
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

// User 검색 끝


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
module.exports.searchUsersByUser = searchUsersByUser;
module.exports.searchUsersByLabel = searchUsersByLabel;
module.exports.getBelongLabel = getBelongLabel;
module.exports.dummyLabel = dummyUser;
