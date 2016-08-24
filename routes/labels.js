var express = require('express');
var router = express.Router();

var isSecure = require('./common').isSecure;

var Label = require('../models/label');


router.post('/', isSecure, function (req, res, next) {
    if (!req.body.label_name) {
        res.send({
            error: {
                message: '페이지를 불러올 수 없습니다.'
            }
        });
    } else {
        var labelList = {};
        labelList.label_name = req.body.label_name;

        labelList.image_path = req.body.image_path || '';
        labelList.genre = req.body.genre || '';
        labelList.text = req.body.text || '';
        labelList.text = req.body.nickname || '';
        labelList.need_position = req.body.need_position || ''; // position 필수인지 다시 확인

        Label.dummyRegisterLabel(labelList, function (err, result) {
            if (err) {
                return next(err);
            }
            else {
                if (result) {
                    res.send({
                        message: '레이블이 생성에 성공했습니다',
                        dummyMessage: 'dummy test를 위한 입력 데이터 출력입니다',
                        dummyData: labelList
                    });
                } else {
                    res.send({
                        error: {
                            message: '레이블 생성에실패했습니다.'
                        }
                    });
                }
            }
        });
    }
});

// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });

router.get('/', isSecure, function (req, res, next) {
    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 3;

    if (!req.label) {
        res.send({
            error: {
                message: '페이지를 불러오지 못했습니다'
            }
        });
    }
    if (req.query.id) {
        // dummy test 용 타계정 페이지
        var id = parseInt(req.query.id);

        User.dummyShowOther(id, page, count, function(err, user){
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    } else {

        User.dummyShowMe(page, count, function(err, user){
            if (err) {
                return next(err);
            }
            res.send(user);
        });
    }
});




//
// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
// router.put('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
// router.put('/', isSecure, function(req, res, next) {
//     res.send('label');
//
// router.delete('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
module.exports = router;