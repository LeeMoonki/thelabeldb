var express = require('express');
var router = express.Router();
var Label = require('../models/label');

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
    if (!req.body.label_name || req.label) {
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

router.get('/', isSecure, isAuthenticate, function (req, res, next) {
    var search = parseInt(req.query.search) || false;
    var setting = parseInt(req.query.setting) || false;
    // 레이블 페이지
    if (req.query.label_id) {
        //레이블 메인페이지
        var page = parseInt(req.query.page) || 1;
        var count = parseInt(req.query.count) || 10;
        var id = parseInt(req.query.id);

        Label.dummylist(page, count, function (err, result) {
            if (err) {
                return next(err);
            }
            res.send(result);
        });
    } else if (search) {
        // dummy test 용 사람 찾기 페이지
        var page = parseInt(req.query.page) || 1;
        var count = parseInt(req.query.count) || 10;
        var searchInfo = {};
        // 지금은 모두 string 처리, 향후 paseInt를 통해 id로 관리
        searchInfo.genre = req.query.genre_id || nuga.need_genre;
        searchInfo.position = req.query.position_id || nuga.need_position;
        searchInfo.city = req.query.city_id || '서울';
        searchInfo.town = req.query.town_id || '관악구';

        Label.searchLabel(page, count, searchInfo, function(err, results){
            if (err) {
                res.send({
                    error: {
                        message: '검색 실패'
                    }
                });
                return next(err);
            } else {
                res.send({
                    page: page,
                    count: count,
                    result : results
                });
            }
        });
    } else if (setting) {
        Label.showSettingLabelPage(nuga, function(err, result){
            if (err) {
                res.send({
                    error: {
                        message: "페이지를 불러오지 못했습니다"
                    }
                });
                return next(err);
            } else {
                res.send(result);
            }
        });
    }
    else {
        var page = parseInt(req.query.page) || 1;
        var count = parseInt(req.query.count) || 3;
        var id = parseInt(req.user.id);

        Label.labelPage(id, page, count, function (err, list) {
            if (err) {
                return next(err);
            }
            res.send(list);
        });
    }
});


//레이블 구성멤버
router.get('/members', isSecure, isAuthenticate, function (req, res, next) {


    Label.labelMember(req.user.id, function (err, result) {
        if (err) {
            return next(err);
        }
        res.send(result);
    });

});

// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
// router.get('/', isSecure, function(req, res, next) {
//     res.send('label');
// });
//
//레이블 설정
router.put('/', isSecure, function (req, res, next) {
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