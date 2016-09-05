var formidable = require('formidable');
var express = require('express');
var path = require('path');
var router = express.Router();

var User = require('../models/user');
var Label = require('../models/label');
var parseBoolean = require('./common').parseBoolean;
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;


router.get('/', isSecure, isAuthenticate, function(req, res, next) {
  
  
  var search = parseBoolean(req.query.search) || false;

  if (search) {

    // 사용자 검색 페이지 시작

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;


    User.getBelongLabel(req.user.id, function (err, label_ids) {
      if (err) {
        return next(err);
      } else {
        // 가입한 레이블이 없거나 검색 조건을 입력했다면 다음과 같이 검색한다
        if (label_ids[0] === undefined || req.query.genre_id || req.query.position_id || req.query.city_id || req.query.city_id) {
          // 검색 조건을 입력했다면 해당 검색 조건이 우선순위로 검색 되어야 하는 구조를 만들어야 한다
          var searchInfo = {};
          searchInfo.genre = req.query.genre_id || req.user.genre_id;
          searchInfo.position = req.query.position_id || req.user.position_id;
          searchInfo.city = req.query.city_id || req.user.city_id;
          searchInfo.town = req.query.town_id || req.user.town_id;

          User.searchUsersByUser(req.user.id, page, count, searchInfo, function (err, results) {
            if (err) {
              return next(err);
            } else {
              var searchResult = {};
              searchResult.page = page;
              searchResult.count = count;
              searchResult.result = results;
              res.send(searchResult);
            }
          });

        } else {
          // 가입한 레이블이 있다면 아래와 같이 검색한다
          Label.getLabelSearchInfoArr(label_ids, function (err, searchInfo) {
            if (err) {
              return next(err);
            } else {
              User.searchUsersByLabel(page, count, searchInfo, function (err, results) {
                if (err) {
                  return next(err);
                } else {
                  var searchResult = {};
                  searchResult.page = page;
                  searchResult.count = count;
                  searchResult.result = results;
                  res.send(searchResult);
                }
              });
            }
          });
        }
      }
    });

    // 사용자 검색 페이지 끝
  } else {

    // 모든 사용자 정보
    
    
    // 모든 사용자 정보 
  }
  
  
});


router.get('/me', isSecure, isAuthenticate, function(req, res, next){

  var setting = parseBoolean(req.query.setting) || false; // req.qury 를 통해 Boolean 값을 넘기면 String이 아닌 Boolean으로 넘어온다
  var dup = parseBoolean(req.query.dup) || false;

  if (dup && req.query.email) {
    // email 중복체크

    var email = req.query.email;

    User.emailDupCheck(email, function(err, result){
      if (err) {
        return next(err);
      } else {
        if (result === 0) {
          res.send({
            match: 0
          });
        } else {
          res.send({
            match: 1
          });
        }
      }
    });

  } else if (dup && req.query.nickname) {
    // nickname 중복체크

    var nickname = req.query.nickname;

    User.nicknameDupCheck(nickname, function(err, result){
      if (err) {
        return next(err);
      } else {
        if (result === 0) {
          res.send({
            match: 0
          });
        } else {
          res.send({
            match: 1
          });
        }
      }
    });

  } else if (setting) {

    // 사용자 설정 페이지 시작

    User.showProfilePage(req.user.id, 0, function (err, user) {
      if (err) {
        return next(err);
      }
      res.send({user: user});
    });

    // 사용자 설정 페이지 끝
  } else {
    // 내 계정 페이지 시작

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 5;
    User.showMe(req.user.id, page, count, function (err, user) {
      if (err) {
        return next(err);
      }
      res.send(user);
    });

    // 내 계정 페이지 끝
  }

});

router.get('/:id', isSecure, isAuthenticate, function(req, res, next){
  
  var id = parseInt(req.params.id);
  
  // 타계정 페이지 시작

  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 5;

  User.userPage(id, page, count, function (err, result) {
    if (err) {
      return next(err);
    }
    res.send(result);
  });

  // 타계정 페이지 끝
  
});


router.post('/', isSecure, function(req, res, next){

    var form = new formidable.IncomingForm();
    // /Users/LEEMOONKI/Desktop/userTestPhotos
    form.uploadDir = path.join(__dirname, '../uploads/images/userProfiles');
    form.keepExtensions = true; // 확장자 유지를 위해, 이걸 false로 하면 확장자가 제거 된다
    form.multiples = true; // 이렇게 하면 files가 array처럼 된다

    form.parse(req, function(err, fields, files) {
      if (err) {
        return next(err);
      } else if (!fields.email || !fields.nickname || !fields.password || !fields.gender || req.user) {
        res.send({
          error: {
            message: '회원 가입을 실패했습니다'
          }
        });
      }
      else {
        var registerInfo = {};



        registerInfo.email = fields.email;
        registerInfo.password = fields.password;
        registerInfo.nickname = fields.nickname;
        registerInfo.gender = parseInt(fields.gender);

        registerInfo.text = fields.text || '';

        registerInfo.position_id = parseInt(fields.position_id) || 1;
        registerInfo.genre_id = parseInt(fields.genre_id) || 1;
        registerInfo.city_id = parseInt(fields.city_id) || 1;
        registerInfo.town_id = parseInt(fields.town_id) || 1;

        if (files.image !== undefined) {
          registerInfo.imagepath = files.image.path;
        } else {
          registerInfo.imagepath = path.join(form.uploadDir, '/facebookprofile.jpg');
        }

        User.registerUser(registerInfo, function(err, result){
          if (err) {
            return next(err);
          }
          else {
            if (result) {
              res.send({
                message: '회원 가입이 정상적으로 처리되었습니다',
                id: result
              });
            } else {
              res.send({
                error: {
                  message: '회원 가입을 실패했습니다'
                }
              });
            }
          }
        });
      }
    });
});

router.put('/me', isSecure, isAuthenticate, function(req, res, next){

  // 내 정보 설정할 때 필요한 변수
  var pass = parseBoolean(req.query.pass) || false;
  var id = req.user.id;

  if (pass) {
    // todo : 안드로이드가 새로운 비밀번호와 다시 입력한 새로운 비밀번호가 같은지 체크해서 보내도록 한다
    // 비밀번호 설정
    // 현재 비밀번호, 새로운 비밀번호를 입력하지 않은 경우 에러생성
    if (!req.body.password || !req.body.new_password) {
      res.send({
        error: {
          message: '현재 비밀번호와 새로운 비밀번호가 필요합니다',
          resultCode: 3
        }
      });
    } else {
      var passInfo = {};
      passInfo.user_id = id;
      passInfo.oldPass = req.body.password;
      passInfo.newPass = req.body.new_password;
      User.checkPassword(passInfo, function(err, result){
        if (err) {
          return next(err);
        } else {
          if (result === 1) {
            // 일치시
            User.updatePassword(passInfo, function (err, result) {
              if (err) {
                return next(err);
              } else {
                // result를 통해 변경된 row의 개수가 전달된다
                res.send({
                  message: '비밀번호 변경',
                  resultCode: 1
                });
              }
            });
          } else {
            // 불일치시 혹은 2개이상이 일치
            res.send({
              message: "비밀번호가 일치하지 않습니다.",
              resultCode: 2
            });
          }
        }
      });

    }

  } else {

    // 일반 정보 수정
    var settingInfo = {};

    // 먼저 기존에 있는 정보를 가져온다
    // todo : 안드로이드와 얘기해서 설정화면에 우리가 보낸 정보를 다시 여기에 보내면 안된다고 한다 그렇게 되면 id 가 아닌 이름이 넘어온다
    User.showProfilePage(id, 1, function(err, results){
      if (err) {
        return next(err);
      } else {

        var form = new formidable.IncomingForm();
        // /Users/LEEMOONKI/Desktop/userTestPhotos
        form.uploadDir = path.join(__dirname, '../uploads/images/userProfiles');
        form.keepExtensions = true; // 확장자 유지를 위해, 이걸 false로 하면 확장자가 제거 된다
        form.multiples = true; // 이렇게 하면 files가 array처럼 된다

        form.parse(req, function(err, fields, files) {
          if (err) {
            return next(err);
          } else {

            settingInfo.user_id = id;
            settingInfo.nickname = fields.nickname || results.nickname;
            settingInfo.gender = parseInt(fields.gender) || results.gender;
            settingInfo.text = fields.text || results.text;
            settingInfo.position_id = parseInt(fields.position_id) || results.position_id;
            settingInfo.genre_id = parseInt(fields.genre_id) || results.genre_id;
            settingInfo.city_id = parseInt(fields.city_id) || results.city_id;
            settingInfo.town_id = parseInt(fields.town_id) || results.town_id;

            if (files.image !== undefined) {
              settingInfo.imagepath = files.image.path;
            } else {
              settingInfo.imagepath = results.dbImagePath;
            }

            // update start
            User.updateUser(settingInfo, function(err, result){
              // result 에는 update 된 row의 개수가 들어있다
              if (err) {
                res.send({
                  message: '수정 실패',
                  resultCode: 0
                });
                return next(err);
              } else {
                res.send({
                  message: '수정 성공',
                  resultCode: 1
                });
              }
            });
            // update end

          }
        });
      }
    });
  }
});





module.exports = router;