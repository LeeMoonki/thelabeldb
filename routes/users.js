var formidable = require('formidable');
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Label = require('../models/label');
var parseBoolean = require('./common').parseBoolean;
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;


router.get('/', isSecure, isAuthenticate, function(req, res, next) {
  
  var setting = parseBoolean(req.query.setting) || false; // req.qury 를 통해 Boolean 값을 넘기면 String이 아닌 Boolean으로 넘어온다
  var search = parseBoolean(req.query.search) || false;

  if (setting && search) {
    res.send({
      error: {
        message: '페이지를 불러오지 못했습니다'
      }
    });
  } else {

    if (!req.user) {
      res.send({
        error: {
          message: '페이지를 불러오지 못했습니다'
        }
      });
    }
    if (req.query.id) {
      // dummy test 용 타계정 페이지
      var page = parseInt(req.query.page) || 1;
      var count = parseInt(req.query.count) || 5;
      var id = parseInt(req.query.id);

      User.userPage(id, page, count, function (err, result) {
        if (err) {
          return next(err);
        }
        res.send(result);
      });
    } else if (setting) {
      // dummy test 용 프로필 설정 페이지
      User.showProfilePage(req.user.id, function (err, user) {
        if (err) {
          return next(err);
        }
        res.send({user: user});
      });
    } else if (search) {
      // dummy test 용 사람 찾기 페이지
      var page = parseInt(req.query.page) || 1;
      var count = parseInt(req.query.count) || 10;


      User.getBelongLabel(req.user.id, function(err, label_ids){
        if (err) {
          return next(err);
        } else {
          // 가입한 레이블이 없거나 검색 조건을 입력했다면 다음과 같이 검색한다
          if (label_ids[0] === undefined || req.query.genre_id || req.query.position_id || req.query.city_id || req.query.city_id) {
            // todo : 검색 조건을 입력했다면 해당 검색 조건이 우선순위로 검색 되어야 하는 구조를 만들어야 한다
            var searchInfo = {};
            searchInfo.genre = req.query.genre_id || req.user.genre_id;
            searchInfo.position = req.query.position_id || req.user.position_id;
            searchInfo.city = req.query.city_id || req.user.city_id;
            searchInfo.town = req.query.town_id || req.user.town_id;

            User.searchUsersByUser(req.user.id, page, count, searchInfo, function(err, results){
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
            Label.getLabelSearchInfoArr(label_ids, function(err, searchInfo){
              if (err) {
                return next(err);
              } else {
                User.searchUsersByLabel(page, count, searchInfo, function(err, results){
                  if (err) {
                    return next(err);
                  } else {var searchResult = {};
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

    } else {
      // dummy test 용 내계정 페이지
      var page = parseInt(req.query.page) || 1;
      var count = parseInt(req.query.count) || 5;
      User.showMe(req.user.id, page, count, function (err, user) {
        if (err) {
          return next(err);
        }
        res.send(user);
      });
    }
  }
});

router.post('/', isSecure, function(req, res, next){

    var form = new formidable.IncomingForm();
    // /Users/LEEMOONKI/Desktop/userTestPhotos
    form.uploadDir = '/Users/LEEMOONKI/Desktop/userTestPhotos';
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

        // todo : 이미지 파일을 받아오는 과정 작성
        registerInfo.text = fields.text || '';

        registerInfo.position_id = parseInt(fields.position_id) || 1;
        registerInfo.genre_id = parseInt(fields.genre_id) || 1;
        registerInfo.city_id = parseInt(fields.city_id) || 1;
        registerInfo.town_id = parseInt(fields.town_id) || 1;

        if (files.image !== undefined) {
          registerInfo.imagepath = files.image.path;
        } else {
          registerInfo.imagepath = '/Users/LEEMOONKI/Desktop/userTestPhotos/facebookprofile';
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

router.put('/', isAuthenticate, function(req, res, next){

  var pass = req.query.pass || false;

  if (pass) {

    if (!req.body.password || !req.body.new_password || !req.body.re_new_password) {
      res.send({
        error: {
          message: '비밀번호 변경실패'
        }
      });
    } else if (req.body.new_password !== req.body.re_new_password) {
      res.send({
        error: {
          message: '비밀번호 변경실패'
        }
      });
    } else {
      User.dummyUpdatePassword(req.user.id, req.body.password, req.body.new_password, function (err, result) {
        if (err) {
          res.send({
            error: {
              message: '비밀번호 변경실패'
            }
          });
          return next(err);
        } else {
          if (result) {
            res.send({
              message: '비밀번호 변경',
              dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
              dummyData: User.dummyLabel.dummy_password
            });
          } else {
            res.send({
              error: {
                message: '비밀번호 변경실패'
              }
            });
          }
        }

      });
    }

  } else {
    User.dummyLabel.dummy_id = req.body.id || req.user.id;
    User.dummyLabel.dummy_email = req.body.email || req.user.email;
    User.dummyLabel.dummy_nickname = req.body.nickname || req.user.nickname;
    User.dummyLabel.dummy_gender = req.body.gender || req.user.gender;
    User.dummyLabel.dummy_position = req.body.position || req.user.position;
    User.dummyLabel.dummy_genre = req.body.genre || req.user.genre;
    User.dummyLabel.dummy_city = req.body.city || req.user.city;
    User.dummyLabel.dummy_town = req.body.town || req.user.town;

    User.dummyUpdateUser(User.dummyLabel, function (err, result) {
      if (err) {
        res.send({
          error: {
            message: '변경 할 수 없습니다'
          }
        });
        return next(err);
      } else {
        if (result) {
          res.send({
            message: '수정 완료',
            dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
            dummyData: User.dummyLabel
          });
        } else {
          res.send({
            error: {
              message: '변경 할 수 없습니다'
            }
          });
        }
      }
    });
  }
});





module.exports = router;