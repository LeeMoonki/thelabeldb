var express = require('express');
var router = express.Router();
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;

var Like = require('../models/like');

/* GET users listing. */
router.get('/', isAuthenticate,function(req, res, next) {

  var page = parseInt(req.query.page) || 1;
  var count = parseInt(req.query.count) || 10;

  Like.dummyShowLikePosts(req.user.id, page, count, function(err, results){


    if (err) {
      res.send({
        error: {
          message: '찾을 수 없습니다'
        }
      });
      return next(err);
    } else {
      res.send({
        page: page,
        count: count,
        posts: results
      });
    }
  });
});

module.exports = router;