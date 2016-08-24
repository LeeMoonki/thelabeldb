var express = require('express');
var router = express.Router();

var Message = require('../models/message');
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;


router.get('/', isAuthenticate, isSecure,function(req, res, next) {

  if (req.query.you) {
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 5;

    Message.dummyShowMessage(req.user.id, req.query.you, page, count, function(err, results){
      if (err) {
        res.send({
          error: {
            message: '쪽지 내용 조회를 실패했습니다'
          }
        });
        return next(err);
      } else {
        res.send({
          page: page,
          count: count,
          messages: results
        });
      }
    });

  } else {
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;

    Message.dummyShowTotalMessage(req.user.id, page, count, function (err, results) {
      if (err) {
        res.send({
          error: {
            message: '쪽지 전체 조회를 실패했습니다'
          }
        });
        return next(err);
      } else {
        res.send({
          page: page,
          count: count,
          results: results
        });
      }
    });
  }
});

router.post('/', isAuthenticate, isSecure,function(req, res, next){
  var you_id = req.body.you_user_id;
  var message = req.body.message || '';

  if (you_id) {

    Message.dummySnedMessage(req.user.id, you_id, message, function (err, result) {
      if (err) {
        res.send({
          error: {
            message: '전송 할 수 없습니다'
          }
        });
        return next(err);
      } else {
        if (result) {
          res.send({
            message: '전송 완료'
          });
        } else {
          res.send({
            error: {
              message: '전송 할 수 없습니다'
            }
          });
        }
      }
    });
  } else {
    res.send({
      error: {
        message: '전송 할 수 없습니다'
      }
    });
  }
});

module.exports = router;