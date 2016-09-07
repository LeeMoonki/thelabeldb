var express = require('express');
var router = express.Router();

var logger = require('./common').logger;
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var parseBoolean = require('./common').parseBoolean;

var Like = require('../models/like');

/* GET users listing. */
router.get('/me', isSecure, isAuthenticate, function(req, res, next) {

  // log 생성
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'query: %j', req.query, {});
  
  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 10;
  
  var user_id = req.user.id;
  
  Like.myLikePosts(user_id, page, count, function(err, result){
    if (err) {
      return next(err);
    } else {
      res.send(result);
    }
  });
  
  
});

router.post('/', isSecure, isAuthenticate, function(req, res, next){

  // log 생성
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'query: %j', req.query, {});
  logger.log('debug', 'body: %j', req.body, {});
  
  var user_id = req.user.id;

  var post = parseBoolean(req.query.post) || false;
  var label = parseBoolean(req.query.label) || false;

  if (post) {
    if (!req.body.post_id) {
      res.send({
        message: 'post_id를 전달하십시오'
      })
    } else {
      var post_id = parseInt(req.body.post_id);
      Like.insertLike(user_id, post_id, 0, function(err){
        if (err) {
          return next(err);
        } else {
          res.send({
            message: '좋아요를 했습니다'
          });
        }
      });
    }

    
  } else if (label) {

    if (!req.body.label_id) {
      res.send({
        message: 'label_id를 전달하십시오'
      })
    } else {
      var label_id = parseInt(req.body.label_id);
      Like.insertLike(user_id, label_id, 1, function(err){
        if (err) {
          return next(err);
        } else {
          res.send({
            message: '좋아요를 했습니다'
          });
        }
      });
    }
    
  } else {
    
  }


});

router.delete('/', isSecure, isAuthenticate, function(req, res, next){

  // log 생성
  logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
  logger.log('debug', 'query: %j', req.query, {});
  logger.log('debug', 'body: %j', req.body, {});
  
  var user_id = req.user.id;

  var post = parseBoolean(req.query.post) || false;
  var label = parseBoolean(req.query.label) || false;

  if (post) {
    if (!req.body.post_id) {
      res.send({
        message: 'post_id를 전달하십시오'
      })
    } else {
      var post_id = parseInt(req.body.post_id);
      Like.deleteLike(user_id, post_id, 0, function(err){
        if (err) {
          return next(err);
        } else {
          res.send({
            message: '좋아요를 취소했습니다'
          });
        }
      });
    }


  } else if (label) {

    if (!req.body.label_id) {
      res.send({
        message: 'label_id를 전달하십시오'
      })
    } else {
      var label_id = parseInt(req.body.label_id);
      Like.deleteLike(user_id, label_id, 1, function(err){
        if (err) {
          return next(err);
        } else {
          res.send({
            message: '좋아요를 취소했습니다'
          });
        }
      });
    }

  } else {

    res.send({
      message: 'post 혹은 label 값을 전달하십시오'
    });

  }

});



module.exports = router;