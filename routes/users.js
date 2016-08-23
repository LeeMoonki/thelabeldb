var express = require('express');
var router = express.Router();

var User = require('../models/user');
var isAuthenticate = require('./common').isAuthenticate;



/* GET users listing. */
router.get('/', isAuthenticate, function(req, res, next) {

  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 10;

  if (!req.user) {
    res.send({
      error: {
        message: '페이지를 불러오지 못했습니다'
      }
    });
  }
  if (req.query.id) {
    // dummy test 용 타계정 페이지
    var id = parseInt(req.query.id);

    User.dummyShowOther(id, page, count, function(err, user){
      if (err) {
        return next(err);
      }
      res.send(user);
    });
  } else {

    User.dummyShowMe(page, count, function(err, user){
      if (err) {
        return next(err);
      }
      res.send(user);
    });
  }
});

router.post('/', function(req, res, next){

  if (!req.body.email || !req.body.nickname || !req.body.password) {
    res.send({
      error: {
        message: '회원 가입을 실패했습니'
      }
    });
  } else {
    var userInfo = {};
    userInfo.email = req.body.email;
    userInfo.password = req.body.password;
    userInfo.nickname = req.body.nickname;

    userInfo.gender = req.body.gender || '';
    userInfo.position = req.body.position || ''; // position 필수인지 다시 확인
    userInfo.genre = req.body.genre || '';
    userInfo.city = req.body.city || '';
    userInfo.town = req.body.town || '';
    
    User.dummyRegisterUser(userInfo, function(err, result){
      if (err) {
        return next(err);
      }
      else {
        if (result) {
          res.send({
            message: '회원 가입이 정상적으로 처리되었습니다',
            dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
            dummyData: userInfo
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

module.exports = router;