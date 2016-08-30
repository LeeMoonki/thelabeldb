var express = require('express');
var router = express.Router();

var User = require('../models/user');

var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var Post = require('../models/post');


router.get('/', isAuthenticate, isSecure, function (req, res, next) {

    var page = parseInt(req.query.page);
    var count = parseInt(req.query.count) || 10;
    var meet = parseInt(req.query.meet) || 2;
    var id = parseInt(req.query.position_id);
    
    // 업로드 할 때 레이블 항목을 보여주기 위한 변수
    var setting = req.query.setting || false;
    
    if (setting) {
        
        Post.postLabelInfo(req.user.id, function(err, results){
            if (err) {
                res.send({
                    error: {
                        message: '업로드 실패'
                    }
                });
            } else {
                res.send({
                    labels : results
                });
            }
        });
        
    } else {
    var meet = parseInt(req.query.meet);

    User.findUser(req.user.id, function(err, result){
        if (err) {
            return next(err);
        } else {
            var position_id = result.position_id;
            Post.homePost(position_id, page, count, meet, function (err, results) {
                if (err) {
                    return next(err);
                } else {
                    res.send(results);
                }
            });

        }
    });


        console.log(page);
        console.log(count);
        console.log(meet);
        console.log(id);
        Post.homePost(id, page, count, meet, function (err, results) {
            if (err) {
                return next(err);
            } else {
                res.send(results);
            }
        });
    }
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