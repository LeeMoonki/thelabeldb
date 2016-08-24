var express = require('express');
var router = express.Router();

var User = require('../models/user');
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;


router.get('/', isAuthenticate, function(req, res, next) {

  var setting = req.query.setting || false; // req.qury 를 통해 Boolean 값을 넘기면 String이 아닌 Boolean으로 넘어온다
  var search = req.query.search || false;

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

    User.dummyShowOther(id, page, count, function(err, user){
      if (err) {
        res.send({
          error: {
            message: '페이지를 불러오지 못했습니다'
          }
        });
        return next(err);
      }
      res.send(user);
    });
  } else if (setting) {
    // dummy test 용 프로필 설정 페이지
    User.dummyShowProfilePage(function(err, result){
      if (err) {
        res.send({
          error: {
            message: '페이지를 불러오지 못했습니다'
          }
        });
        return next(err);
      }
      res.send(result);
    });
  } else if (search) {
    // dummy test 용 사람 찾기 페이지
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;
    var searchInfo = {};
    // 지금은 모두 string 처리, 향후 paseInt를 통해 id로 관리
    searchInfo.genre = req.query.genre_id || req.user.genre;
    searchInfo.position = req.query.position_id || req.user.position;
    searchInfo.city = req.query.city_id || req.user.city;
    searchInfo.town = req.query.town_id || req.user.town;
    
    User.dummySearchUsers(page, count, searchInfo, function(err, results){
      if (err) {
        res.send({
          error: {
            message: '검색 실패'
          }
        });
        return next(err);
      } else {
        res.send({
          page: page,
          count: count,
          result : results
        });
      }
    });

  } else {
    // dummy test 용 내계정 페이지
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 5;
    User.dummyShowMe(page, count, function(err, user){
      if (err) {
        res.send({
          error: {
            message: '페이지를 불러오지 못했습니다'
          }
        });
        return next(err);
      }
      res.send(user);
    });
  }
});

router.post('/', function(req, res, next){

  if (!req.body.email || !req.body.nickname || !req.body.password || req.user) {
    res.send({
      error: {
        message: '회원 가입을 실패했습니'
      }
    });
  } else {
    User.dummyUser.dummy_email = req.body.email;
    User.dummyUser.dummy_password = req.body.password;
    User.dummyUser.dummy_nickname = req.body.nickname;

    User.dummyUser.dummy_gender = req.body.gender || '';
    User.dummyUser.dummy_position = req.body.position || ''; // position 필수인지 다시 확인
    User.dummyUser.dummy_genre = req.body.genre || '';
    User.dummyUser.dummy_city = req.body.city || '';
    User.dummyUser.dummy_town = req.body.town || '';

    console.log(User.dummyUser);

    User.dummyRegisterUser(User.dummyUser, function(err, result){
      if (err) {
        res.send({
          error: {
            message: '회원 가입을 실패했습니'
          }
        });
        return next(err);
      }
      else {
        if (result) {
          res.send({
            message: '회원 가입이 정상적으로 처리되었습니다',
            dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
            dummyData: User.dummyUser
          });
        } else {
          res.send({
            error: {
              message: '회원 가입을 실패했습니'
            }
          });
        }
      }
    });

  }


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
              dummyData: User.dummyUser.dummy_password
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
    User.dummyUser.dummy_id = req.body.id || req.user.id;
    User.dummyUser.dummy_email = req.body.email || req.user.email;
    User.dummyUser.dummy_nickname = req.body.nickname || req.user.nickname;
    User.dummyUser.dummy_gender = req.body.gender || req.user.gender;
    User.dummyUser.dummy_position = req.body.position || req.user.position;
    User.dummyUser.dummy_genre = req.body.genre || req.user.genre;
    User.dummyUser.dummy_city = req.body.city || req.user.city;
    User.dummyUser.dummy_town = req.body.town || req.user.town;

    User.dummyUpdateUser(User.dummyUser, function (err, result) {
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
            dummyData: User.dummyUser
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