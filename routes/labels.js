var express = require('express');
var formidable = require('formidable');
var async = require('async');
var router = express.Router();
var Label = require('../models/label');
var User = require('../models/user');

var parseBoolean = require('./common').parseBoolean;
var isSecure = require('./common').isSecure;
var isAuthenticate = require('./common').isAuthenticate;


var nuga = {};
nuga.id = 1;
nuga.name = 'NUGA';
nuga.image_path = '/usr/desktop/didimdol.jpg';
nuga.need_genre = '락';
nuga.need_position = '베이스';
nuga.text = 'hihihihihihihihihi';


router.post('/', isSecure, isAuthenticate, function (req, res, next) {
    // todo : 레이블 생성

    var form = new formidable.IncomingForm();
    // /Users/LEEMOONKI/Desktop/userTestPhotos
    form.uploadDir = '/Users/LEEMOONKI/Desktop/userTestPhotos';
    form.keepExtensions = true; // 확장자 유지를 위해, 이걸 false로 하면 확장자가 제거 된다
    form.multiples = true; // 이렇게 하면 files가 array처럼 된다
    
    var formFields = {};
    
    form.on('field', function(name, value){

        function makeFormFields(prop, val) {
            if (!formFields[prop]) {
                formFields[prop] = val;
            } else {

                if (formFields[prop] instanceof Array) {
                    // 배열일 경우
                    formFields[prop].push(val);
                } else {
                    // 배열이 아닐 경우
                    var tmp = formFields[prop];
                    formFields[prop] = [];
                    formFields[prop].push(tmp);
                    formFields[prop].push(val);
                }
            }
        }
        // 원래 []는 [0-9a-zA-Z] 문자 중 하나라는 뜻
        var re1 = /\[\]/;
        var re2 = /\[\d+\]/; // + 는 하나 이상
        if (name.match(re1)) {
            name = name.replace(re1, '');
        } else if (name.match(re2)) {
            name = name.replace(re2, '');
        }
        makeFormFields(name, value);

    });
    
    form.parse(req, function(err, fields, files) {
        if (err) {
            return next(err);
        } else if (!formFields.label_name || !formFields.genre_id) {
            res.send({
                error: {
                    message: '페이지를 불러올 수 없습니다.'
                }
            });
        }
        else {
            var createInfo = {};

            createInfo.authority_user_id = req.user.id;
            createInfo.label_name = formFields.label_name;
            createInfo.genre_id = parseInt(formFields.genre_id);

            createInfo.text = formFields.text || '';

            if (formFields.need_position_id !== undefined) {
                // need_position_id 가 있다면 parseInt 해준다
                var tempArr = [];
                async.each(formFields.need_position_id, function(item, done){
                    tempArr.push(parseInt(item));
                    done(null);
                }, function(err){
                    // done
                    if (err) {
                        // done(err) 발생하지 않는다
                    } else {
                        createInfo.position_id = tempArr;
                    }
                });

            } else {
                createInfo.position_id = [1];
            }

            if (files.image !== undefined) {
                createInfo.imagepath = files.image.path;
            } else {
                createInfo.imagepath = '/Users/LEEMOONKI/Desktop/userTestPhotos/theLabel';
            }
            console.log(createInfo);
            Label.createLabel(createInfo, function(err, result){
                if (err) {
                    return next(err);
                }
                else {
                    if (result !== 0) {
                        res.send({
                            message: '레이블 생성에 성공했습니다',
                            testResult: result
                        });
                    } else {
                        res.send({
                            error: {
                                message: '레이블 생성에 실패했습니다'
                            }
                        });
                    }
                }
            });
        }
    });
});

router.get('/', isSecure, isAuthenticate, function (req, res, next) {
    
    var search = parseBoolean(req.query.search) || false;
    var setting = parseBoolean(req.query.setting) || false;

    if (search && setting) {
        res.send({
            error: {
                message: '페이지를 불러오지 못했습니다'
            }
        });
    } else {
        // 레이블 페이지
        if (!search && !setting && req.query.label_id) {
            //레이블 메인페이지
            var page = parseInt(req.query.page) || 1;
            var count = parseInt(req.query.count) || 10;
            var id = parseInt(req.query.label_id);

            Label.labelMain(id, page, count, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.send(result);
            });
        } else if (search) {
            // 레이블 찾기 구현
            var page = parseInt(req.query.page) || 1;
            var count = parseInt(req.query.count) || 10;

            info = {};

            info.genre_id = req.query.genre_id || req.user.genre_id;
            info.position_id = req.query.position_id || req.user.position_id;

            User.getBelongLabel(req.user.id, function(err, label_ids){
                if (err) {
                    return next(err);
                } else {
                    Label.searchLabel(label_ids, page, count, info, function(err, results){
                        if (err) {
                            return next(err);
                        } else {
                            res.send(results);
                        }
                    });
                }
            });
            
        } else if (setting && req.query.label_id) {
            
            var id = parseInt(req.query.label_id);
            
            Label.showSettingLabelPage(id, function (err, label) {
                if (err) {
                    return next(err);
                } else {
                    res.send({label: label});
                }
            });
        }
        else {
            var id = parseInt(req.user.id);

            Label.labelPage(id, function (err, list) {
                if (err) {
                    return next(err);
                }
                res.send(list);
            });
        }
    }
});


//레이블 구성멤버
router.get('/members', isSecure, isAuthenticate,function (req, res, next) {

    var label_id = parseInt(req.query.label_id);

    if (!label_id) {
        res.send('레이블 멤버 출력 실패');
    } else {
        Label.labelMember(label_id, function (err, result) {
            if (err) {
                return next(err);
            }
            res.send(result);
        });
    }
    

});


//레이블 설정
router.put('/', isSecure, isAuthenticate,function (req, res, next) {
    var settingInfo = {};

    settingInfo.text = req.body.text || nuga.text;
    settingInfo.image_path = req.body.image_path || nuga.image_path;
    settingInfo.genre = req.body.need_genre || nuga.need_genre;
    settingInfo.position = req.body.need_position || nuga.need_position;

    Label.updateLabel(settingInfo, function(err, result){
        if (err) {
            res.send({
                error: {
                    message: '레이블 설정에 실패했습니다'
                }
            });
            return next(err);
        } else {
            res.send({
                message: '레이블이 설정에 성공했습니다',
                dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
                dummyData: result
            });
        }
    });
});

// router.put('/', isSecure, function(req, res, next) {
//     res.send('label');
//
// router.delete('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
    module.exports = router;