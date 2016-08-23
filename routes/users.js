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
  res.send({
    page: page,
    count: count,
    result: {
      id: 1,
      nickname: '닉네임',
      image_page: '/usr/desktop/didimdol.jpg',
      genre: '발라드',
      post_count: 2,
      data: [
        {
          id: 2,
          user_id: 1,
          nickname: '닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol.mp3',
          date: '2016-08-23',
          like: 3
        },
        {
          id: 5,
          user_id: 1,
          nickname: '닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol2.mp3',
          date: '2016-08-23',
          like: 0
        }
      ]
    }
  });
});

module.exports = router;