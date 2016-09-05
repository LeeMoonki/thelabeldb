var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();

var User = require('../models/user');

var parseBoolean = require('./common').parseBoolean;
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var Post = require('../models/post');

router.get('/', isAuthenticate, isSecure, function (req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;
    var meet = parseInt(req.query.meet) || 2;
    
    var getPostInfo = {};
    getPostInfo.user_id = req.user.id;
    getPostInfo.position_id = req.user.position_id;
    getPostInfo.genre_id = req.user.genre_id;
    
    getPostInfo.page = page;
    getPostInfo.count = count;
    getPostInfo.meet = meet;
    
    Post.showHomePosts(getPostInfo, function(err, results){
        if (err) {
            return next(err);
        } else {
            res.send(results);
        }
    });
    
    //
    // User.findUser(req.user.id, function (err, result) {
    //     if (err) {
    //         return next(err);
    //     } else {
    //         var position_id = result.position_id;
    //         Post.homePost(position_id, page, count, meet, function (err, results) {
    //             if (err) {
    //                 return next(err);
    //             } else {
    //                 res.send(results);
    //             }
    //         });
    //
    //     }
    // });

});

router.post('/', isAuthenticate, isSecure, function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads/postFiles');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        } else {
            
            if (!fields.filetype || !files.file || !fields.opento) {
                return next(new Error('필수 정보를 입력하십시오'));
            } else {

                var post = {};

                post.user_id = parseInt(req.user.id);
                
                post.filetype = fields.filetype;
                post.filepath = files.file.path;
                post.opento = fields.opento;

                post.filetitle = fields.filetitle || '제목없음';
                post.text = fields.text;
                post.label_id = parseInt(fields.label_id) || 0;
                

                Post.postUpload(post, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.send({message: '업로드 완료'});
                    console.log(result);
                });
            }
        }
    });
});

router.put('/:post_id', isAuthenticate, isSecure, function(req, res, next){

    var post_id = parseInt(req.params.post_id);

    var settingInfo = {};


    Post.getAPostInfo(post_id, function(err, result){
        if (err) {
            return next(err);
        } else {
            settingInfo.post_id = post_id;
            settingInfo.text = req.body.text || result.text;
            settingInfo.opento = req.body.opento || result.opento;
            Post.updatePost(settingInfo, function(err){
                if (err) {
                    return next(err);
                } else {
                    res.send({
                        message: '게시물 수정에 성공했습니다',
                        resultCode: 1
                    });
                }
            });
        }
    });

});

module.exports = router;