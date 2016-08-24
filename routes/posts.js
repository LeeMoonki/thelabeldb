var express = require('express');
var router = express.Router();
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var Post = require('../models/post');


router.get('/', isAuthenticate, isSecure, function(req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;
    var meet = parseInt(req.query.meet) || 2;
    
    Post.dummyShowPosts(page, count, meet, function(err, meetresults, results){
      if (err) {
        
      } else {
        res.send({
          page: page,
          count: count,
          meet: meet,
          meetdata: meetresults,
          data: results
        });
        
      }
    });
});

router.post('/', isAuthenticate, isSecure, function (req, res, next) {

  if (!req.body.filetype || !req.body.file_path || !req.body.opento) {
    res.send({
      error: {
        message: '업로드 실패'
      }
    });
  } else {
    var postInfo = {};
    postInfo.id = req.user.id;
    postInfo.nickname = req.user.nickname;
    postInfo.filetype = req.body.filetype;
    postInfo.file_path = req.body.file_path;
    postInfo.opento = req.body.opento;

    postInfo.text = req.body.text || '';

    Post.dummyUploadPost(postInfo, function (err, result) {
      if (result) {
        res.send({
          message: '업로드 완료'
        });
      } else {
        res.send({
          error: {
            message: '업로드 실패'
          }
        });
      }
    });
  }
});


module.exports = router;