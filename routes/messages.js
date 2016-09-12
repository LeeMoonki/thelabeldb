var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');

var Message = require('../models/message');
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;

router.post('/', isAuthenticate, isSecure, function(req, res, next){

  if (!req.body.user_id || !req.body.message) {
    res.send({
      message: 'user_id와 message는 필수 정보 입니다'
    });
  }

  var userId = parseInt(req.body.user_id);
  var msg = req.body.message;

  Message.getRegID(userId, function(err, regId){

    if (err) {
      return next(err);
    } else {

      var tokens = [];
      tokens.push(regId);

      var message = new gcm.Message({
        notification: {
          body: msg
        }
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


      var sender = new gcm.Sender('AIzaSyB7amTJpCeivleEGbX2rGNPna97eROPwFI');

      sender.send(message, {registrationTokens: tokens}, function (err, response) {
        if (err) {
          return next(err);
        }
        res.send(response);
      });

    }

  });
});

module.exports = router;