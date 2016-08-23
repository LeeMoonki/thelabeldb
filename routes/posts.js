var express = require('express');
var router = express.Router();
var isAuthenticate = require('./common').isAuthenticate;

var Post = require('../models/post');

/* GET users listing. */
router.get('/', isAuthenticate, function(req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;
    var meet = parseInt(req.query.meet) || 2;

    if (!req.user) {
        res.send({
            error: {
                message: '게시글이 없습니다'
            }
        });
    }

    res.send({
        page: page,
        count: count,
        meet: meet,
        meetdata: [{
            id: 2,
            user_id: 1,
            nickname: '닉네임',
            filetype: 0,
            file_path: '/usr/desktop/didimdol.mp3',
            date: '2016-08-23',
            like: 3
        }],
        date: [{
            id: 3,
            user_id: 1,
            nickname: '닉네임3',
            filetype: 1,
            file_path: '/usr/desktop/didimdol2.jpg',
            date: '2016-08-23',
            like: 3
        }, {
            id: 4,
            user_id: 1,
            nickname: '닉네임5',
            filetype: 0,
            file_path: '/usr/desktop/didimdol8.mp3',
            date: '2016-08-23',
            like: 3
        }]
    });
});

router.post('/', function (req, res, next) {
   res.send({
      message: '업로드 완료'
   });
});
module.exports = router;