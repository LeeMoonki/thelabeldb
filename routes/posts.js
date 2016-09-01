var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var User = require('../models/user');

var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var Post = require('../models/post');

router.get('/', isAuthenticate, isSecure, function (req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;
    var meet = parseInt(req.query.meet) || 2;

    // 업로드 할 때 레이블 항목을 보여주기 위한 변수
    var setting = req.query.setting || false;

    if (setting) {

        Post.postLabelInfo(req.user.id, function (err, results) {
            if (err) {
                res.send({
                    error: {
                        message: '업로드 실패'
                    }
                });
            } else {
                res.send({
                    labels: results
                });
            }
        });

    } else {

        User.findUser(req.user.id, function (err, result) {
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
        // User.findUser(req.user.id, function (err, result) {
        //     if (err) {
        //         return next(err);
        //     } else {
        //         var position_id = result.position_id;
        Post.homePost(req.user.position_id, page, count, meet, function (err, results) {
            if (err) {
                return next(err);
            } else {
                res.send(results);
            }
        });

        // }
        // });
    }
});

router.post('/', isAuthenticate, isSecure, function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join('C:/Users/Do/Desktop/testPhotos');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        }
        var post = {};
        post.user_id = parseInt(req.user.id);
        post.text = fields.text;
        post.opento = fields.opento;
        post.label_id = parseInt(fields.label_id) || 0;
        post.filetitle = fields.filetitle || '제목없음';
        post.filetype = fields.filetype;

        if (files.file) {
            post.filepath = files.file.path;
        } else {
            post.filepath = 'C:\\Users\\Do\\Desktop\\testPhotos\\11.jpg';
        }

        Post.postUpload(post, function (err, result) {
            if (err) {
                return next(err);
            }
            res.send({message: '업로드 완료'});
            console.log(result);
        });
    });

});

module.exports = router;