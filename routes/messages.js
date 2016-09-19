var express = require('express');
var router = express.Router();
var fcm = require('node-gcm');
var logger = require('./common').logger;

var Message = require('../models/message');
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;

router.post('/', isAuthenticate, isSecure, function(req, res, next){
  // log 생성
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'body: %j', req.body, {});

  if (!req.body.user_id || !req.body.message) {
    res.send({
      message: 'user_id와 message는 필수 정보 입니다'
    });
  } else {

    var youId = parseInt(req.body.user_id);
    var msg = req.body.message;
    var userId = req.user.id;
    
    Message.insertMessage(userId, youId, msg, function(err, result){
      if (err) {
        return next(err);
      } else {

        Message.getRegID(youId, function (err, regId) {

          if (err) {
            return next(err);
          } else {


            var tokens = [];
            tokens.push(regId);

            var message = new fcm.Message({
              data: {
                receiverId: userId,
                message: msg
              }
              // ,
              // notification: {
              //   title: 'message wattdda',
              //   body: 'quickly read it!!'
              // }
            });

            // var message = new fcm.Message({
            //   data: {
            //     key1: 'value1',
            //     key2: 'value2'
            //   },
            //   notification: {
            //     title: '',
            //     icon: '',
            //     body: ''
            //   }
            // });

            // 내 FireBase
            // var sender = new fcm.Sender('AIzaSyCylDbj-lZc9FIDZaJrKe06bCSFp1WQvpU');


            var sender = new fcm.Sender('AIzaSyB7amTJpCeivleEGbX2rGNPna97eROPwFI');

            sender.send(message, {registrationTokens: tokens}, function (err, response) {
              if (err) {
                return next(err);
              }
              res.send(response);
            });

          }

        });
        
      }
    });
  }
});

router.get('/:user_id', isAuthenticate, isSecure, function(req, res, next){
  // log 생성
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'query: %j', req.query, {});

  // user_id 는 로그인 한 사람과 통신한 사용자의 id
  var userId = req.user.id;
  var youId = parseInt(req.params.user_id);
  var date = req.query.date || '2016-01-01_00:00:00';

  Message.findMessage(userId, youId, date, function(err, results){
    if (err) {
      return next(err);
    } else {
      res.send({
        message: results
      });
    }
  });
  

});


module.exports = router;