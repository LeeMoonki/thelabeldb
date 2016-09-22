var express = require('express');
var formidable = require('formidable');
var path = require('path');
var router = express.Router();

var User = require('../models/user');

var logger = require('./common').logger;
var unlinkFile = require('./common').unlinkFile;
var parseBoolean = require('./common').parseBoolean;
var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;
var Post = require('../models/post');

router.get('/', isAuthenticate, isSecure, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

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

    Post.showHomePosts(getPostInfo, function (err, results) {
        if (err) {
            return next(err);
        } else {
            res.send(results);
        }
    });
});

router.post('/', isAuthenticate, isSecure, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads/postFiles');
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        } else {

            // log 생성
            logger.log('debug', 'formidable fields : %j', fields, {});
            logger.log('debug', 'formidable files : %j', files, {});

            if (!fields.filetype || (!files.file && !fields.file) || !fields.opento) {
                if (files.file) {
                    unlinkFile(files.file.path, function (err, code) {
                        if (err) {
                            return next(err);
                        } else {
                            res.send({
                                message: '필수 정보를 입력하십시오'
                            });
                        }
                    });
                } else {
                    res.send({
                        message: '필수 정보를 입력하십시오'
                    });
                }

            } else if (fields.filetype < 0 || fields.filetype > 2) {
                if (files.file) {
                    unlinkFile(files.file.path, function (err, code) {
                        if (err) {
                            return next(err);
                        } else {
                            res.send({
                                message: 'filetype은 0, 1, 2 중에 하나의 값을 넣어야 합니다'
                            });
                        }
                    });
                } else {
                    res.send({
                        message: 'filetype은 0, 1, 2 중에 하나의 값을 넣어야 합니다'
                    });
                }

            } else if (fields.opento < 0 || fields.opento > 2) {
                if (files.file) {
                    unlinkFile(files.file.path, function (err, code) {
                        if (err) {
                            return next(err);
                        } else {
                            res.send({
                                message: 'opento는 0, 1, 2 중에 하나의 값을 넣어야 합니다'
                            });
                        }
                    });
                } else {
                    res.send({
                        message: 'opento는 0, 1, 2 중에 하나의 값을 넣어야 합니다'
                    });
                }
            } else {

                var post = {};

                post.user_id = parseInt(req.user.id);

                post.filetype = parseInt(fields.filetype);
                if (post.filetype === 2) {
                    post.filepath = fields.file;
                } else {
                    post.filepath = files.file.path;
                }

                post.opento = parseInt(fields.opento);

                post.filetitle = fields.filetitle || '제목없음';
                post.text = fields.text;
                post.label_id = parseInt(fields.label_id) || 0;


                Post.postUpload(post, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    // result 에는 새로 업로드 된 게시물 id가 들어있다
                    res.send({message: '업로드 완료'});
                });
            }
        }
    });
});

router.put('/:post_id', isAuthenticate, isSecure, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);

    var post_id = parseInt(req.params.post_id);

    var settingInfo = {};


    Post.getAPostInfo(post_id, function (err, result) {
        if (err) {
            return next(err);
        } else {
            settingInfo.post_id = post_id;
            settingInfo.text = req.body.text || result.text;
            settingInfo.opento = req.body.opento || result.opento;
            Post.updatePost(settingInfo, function (err) {
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

router.delete('/', isAuthenticate, isSecure, function (req, res, next) {
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});
    logger.log('debug', 'body: %j', req.body, {});

    var post_id = parseInt(req.body.post_id);
    var user_id = parseInt(req.user.id);
    Post.post_delete(post_id, function (err, result) {
        if (err) {
            return next(err);
        } else {
            Post.showPost(user_id, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (result[0].user_id === user_id) {
                        res.send({message: '게시물이 삭제되었습니다.'})
                    } else if(result[0].user_id !== user_id){
                        res.send({message: '다른 유저의 게시물은 삭제할수 없습니다.'})
                    }
                }
            })
        }
    });
});

module.exports = router;