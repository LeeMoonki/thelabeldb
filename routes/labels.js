var express = require('express');
var formidable = require('formidable');
var async = require('async');
var path = require('path');
var router = express.Router();
var Label = require('../models/label');
var User = require('../models/user');

var logger = require('./common').logger;
var unlinkFile = require('./common').unlinkFile;
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

    var form = new formidable.IncomingForm();
    // /Users/LEEMOONKI/Desktop/userTestPhotos
    form.uploadDir = path.join(__dirname, '../uploads/images/labelProfiles');
    form.keepExtensions = true; // 확장자 유지를 위해, 이걸 false로 하면 확장자가 제거 된다
    form.multiples = true; // 이렇게 하면 files가 array처럼 된다

    var formFields = {};

    form.on('field', function (name, value) {

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

    form.parse(req, function (err, fields, files) {
        if (err) {
            return next(err);
        } else if (!formFields.label_name || !formFields.genre_id) {
            if (files.image) {
                unlinkFile(files.image.path, function(err, code){
                    if (err) {
                        return next(err);
                    } else {
                        res.send({
                            error: {
                                message: 'label_name과 genre_id는 필수정보입니다.',
                                resultCode: 1
                            }
                        });
                    }
                });
            } else {
                res.send({
                    error: {
                        message: 'label_name과 genre_id는 필수정보입니다.',
                        resultCode: 1
                    }
                });
            }
        }
        else {
            // log 생성
            logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
            logger.log('debug', 'formidable fields : %j', fields, {});
            logger.log('debug', 'formidable files : %j', files, {});

            var createInfo = {};

            createInfo.authority_user_id = req.user.id;
            createInfo.label_name = formFields.label_name;
            createInfo.genre_id = parseInt(formFields.genre_id);

            createInfo.text = formFields.text || '';

            if (formFields.need_position_id !== undefined) {
                // need_position_id 가 있다면 parseInt 해준다
                var tempArr = [];
                async.each(formFields.need_position_id, function (item, done) {
                    tempArr.push(parseInt(item));
                    done(null);
                }, function (err) {
                    // done
                    if (err) {
                        // done(err) 발생하지 않는다
                    } else {
                        createInfo.position_id = tempArr;
                    }
                });

            } else {
                // 선택한 position_id 가 없다면 선택하지 않음인 1이 자동으로 들어간다
                createInfo.position_id = [1];
            }

            if (files.image !== undefined) {
                // 여기에 uploadDir 도 다 들어간다 
                createInfo.imagepath = files.image.path;
            } else {
                createInfo.imagepath = path.join(form.uploadDir, '/theLabel.png');
            }

            Label.createLabel(createInfo, function (err, result) {
                if (err) {
                    if (files.image) {
                        unlinkFile(files.image.path, function(unlinkerr, code){
                            if (unlinkerr) {
                                return next(unlinkerr);
                            } else {
                                return next(err);
                            }
                        });
                    } else {
                        return next(err);
                    }
                }
                else {
                    if (result === 0) {
                        res.send({
                            message: '레이블 생성에 성공했습니다',
                            resultCode: 0
                        });
                    } else if (result === 1) {
                        if (files.image) {
                            unlinkFile(files.image.path, function(err, code){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.send({
                                        message: '이미 존재하는 레이블 이름입니다',
                                        resultCode: 2
                                    });
                                }
                            });
                        } else {
                            res.send({
                                message: '이미 존재하는 레이블 이름입니다',
                                resultCode: 2
                            });
                        }
                    } else if (result === 2) {
                        if (files.image) {
                            unlinkFile(files.image.path, function(err, code){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.send({
                                        message: '이미 가입한 레이블의 수가 3이상입니다',
                                        resultCode: 3
                                    });
                                }
                            });
                        } else {
                            res.send({
                                message: '이미 가입한 레이블의 수가 3이상입니다',
                                resultCode: 3
                            });
                        }
                    } else {
                        if (files.image) {
                            unlinkFile(files.image.path, function(err, code){
                                if (err) {
                                    return next(err);
                                } else {
                                    res.send({
                                        error: {
                                            message: '레이블 생성에 실패했습니다',
                                            resultCode: 4
                                        }
                                    });
                                }
                            });
                        } else {
                            res.send({
                                error: {
                                    message: '레이블 생성에 실패했습니다',
                                    resultCode: 4
                                }
                            });
                        }
                    }
                }
            });
        }
    });
});

router.post('/:label_id', isSecure, isAuthenticate, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    // 레이블 가입을 위한 변수
    var join = parseBoolean(req.query.join) || false;

    if (join) {

        var joinInfo = {};
        joinInfo.label_id = parseInt(req.params.label_id);
        joinInfo.user_id = req.user.id;

        Label.checkCanJoin(joinInfo.user_id, joinInfo.label_id, function (err, code) {
            if (err) {
                return next(err);
            } else if (code === 0) {
                // 가입 가능
                Label.joinLabel(joinInfo, function (err, result) {
                    if (err) {
                        return next(err);
                    } else {
                        res.send({
                            message: '레이블에 가입되었습니다',
                            resultCode: 1
                        });
                    }
                });
            } else {
                // 가입 불가능
                if (code === 1) {
                    res.send({
                        message: '가입한 레이블이 3개 이상입니다',
                        resultCode: 2
                    });
                } else {
                    res.send({
                        message: '이미 가입한 레이블입니다',
                        resultCode: 2
                    });
                }
            }
        });
    } else {
        res.send({
            message: 'join 값을 확인하십시오',
            resultCode: 2
        });
    }
});

router.get('/', isSecure, isAuthenticate, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    var search = parseBoolean(req.query.search) || false;
    var dup = parseBoolean(req.query.dup) || false;
    var nameSearch = parseBoolean(req.query.nameSearch) || false;


    // var labelPage = parseBoolean(req.query.labelPage) || false;

    if (search) {
        // 레이블 찾기 구현
        var page = parseInt(req.query.page) || 1;
        var count = parseInt(req.query.count) || 10;

        var info = {};

        info.genre_id = req.query.genre_id || req.user.genre_id;
        info.position_id = req.query.position_id || req.user.position_id;

        User.getBelongLabel(req.user.id, function (err, label_ids) {
            if (err) {
                return next(err);
            } else {
                Label.searchLabel(label_ids, page, count, info, function (err, results) {
                    if (err) {
                        return next(err);
                    } else {
                        var searchResult = {};
                        searchResult.page = page;
                        searchResult.count = count;
                        searchResult.result = results;
                        res.send(searchResult);
                    }
                });
            }
        });

    } else if (nameSearch) {

        var sort = req.query.sort || 'genre';

        var page = parseInt(req.query.page) || 1;
        var count = parseInt(req.query.count) || 10;
        var text = req.query.text;
        var content = '%' + text + '%';

        if (sort === 'genre') {
            Label.search_sortGenre(content, page, count, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (text === '') {
                        res.send({
                            message : '검색어를 입력하시오.'
                        });
                    } else if (result.result.length === 0) {
                        res.send('검색 결과가 없습니다.');
                    } else {
                        res.send(result);
                    }
                }
            });
        } else if (sort === 'position') {
            Label.search_sortPosition(content, page, count, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (text === '') {
                        res.send({
                            message : '검색어를 입력하시오.'
                        });
                    } else if (result.result.length === 0) {
                        res.send('검색 결과가 없습니다.');
                    } else {
                        res.send(result);
                    }
                }
            });
        } else if (sort === '') {
            Label.search_sortGenre(content, page, count, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (text === '') {
                        res.send({
                            message : '검색어를 입력하시오.'
                        });
                    } else if (result.result.length === 0) {
                        res.send('검색 결과가 없습니다.');
                    } else {
                        res.send(result);
                    }
                }
            });
        }
    } else if (dup) {
        if (req.query.label_name) {
            // 레이블 이름 중복 체크
            var label_name = req.query.label_name;
            Label.nameDupCheck(label_name, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (result === 0) {
                        res.send({
                            match: 0
                        });
                    } else {
                        res.send({
                            match: 1
                        });
                    }
                }
            });
        } else {
            res.send({
                error: {
                    message: '중복체크 실패'
                }
            });
        }
    } else {
        // 전체 레이블 목록
        res.send({
            message: 'url 주소 확인'
        });
    }
});


router.get('/me', isSecure, isAuthenticate, function (req, res, next) {
    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    // 레이블 페이지; 가입한 레이블 목록
    Label.labelPage(req.user.id, function (err, list) {
        if (err) {
            return next(err);
        }
        res.send(list);
    });
});

router.get('/:label_id', isSecure, isAuthenticate, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    var user_id = req.user.id;
    var label_id = parseInt(req.params.label_id);
    var members = parseBoolean(req.query.members) || false;
    var setting = parseBoolean(req.query.setting) || false;
    var del = parseBoolean(req.query.del) || false;

    if ((members && setting) || (members && del) || (setting && del)) {
        res.send({
            error: {
                message: '페이지를 불러오지 못했습니다'
            }
        });
    } else {
        if (setting) {
            // 레이블 설정 페이지
            Label.showSettingLabelPage(label_id, 0, function (err, label) {
                if (err) {
                    return next(err);
                } else {
                    res.send({label: label});
                }
            });
        } else if (members) {
            // 레이블 구성멤버
            Label.labelMember(label_id, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.send(result);
            });
        } else if (del) {
            // 레이블 탈퇴 GET
            Label.get_deleteMember(label_id, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    if (result[0].authority_user_id !== user_id) {
                        Label.get_myprofile(label_id, user_id, function (err, myprofile) {
                            if (err) {
                                return next(err);
                            }
                            res.send({users: myprofile});
                        });
                    } else {
                        res.send({users: result});
                    }
                }
            });
        } else {

            //레이블 메인페이지
            var page = parseInt(req.query.page) || 1;
            var count = parseInt(req.query.count) || 10;

            Label.labelMain(label_id, page, count, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.send(result);
            });
        }
    }
});


//레이블 설정
router.put('/:label_id', isSecure, isAuthenticate, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    // 레이블 권한위임을 위한 변수
    var members = parseBoolean(req.query.members) || false;

    // 레이블 수정시에 필요한 레이블 아이디
    var label_id = parseInt(req.params.label_id);

    if (members) {

        // log 생성
        logger.log('debug', 'body: %j', req.body, {});

        // 레이블 권한 변경
        var user_id = parseInt(req.body.user_id);
        if (!user_id) {
            // user_id 를 입력하지 않았을 때
            return next(new Error('user_id 가 필요합니다'));
        } else {
            Label.authorize(user_id, label_id, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    res.send({
                        message: '권한 변경에 성공하였습니다',
                        resultCode: 1
                    });
                }
            });
        }

    } else {
        // 레이블 수정
        var settingInfo = {};

        Label.showSettingLabelPage(label_id, 1, function (err, results) {
            if (err) {
                return next(err);
            } else {
                var form = new formidable.IncomingForm();
                // /Users/LEEMOONKI/Desktop/userTestPhotos
                form.uploadDir = path.join(__dirname, '../uploads/images/labelProfiles');
                form.keepExtensions = true; // 확장자 유지를 위해, 이걸 false로 하면 확장자가 제거 된다
                form.multiples = true; // 이렇게 하면 files가 array처럼 된다

                var formFields = {};

                form.on('field', function (name, value) {

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

                form.parse(req, function (err, fields, files) {
                    if (err) {
                        return next(err);
                    } else {

                        // log 생성
                        logger.log('debug', 'formidable fields : %j', fields, {});
                        logger.log('debug', 'formidable files : %j', files, {});

                        settingInfo.label_id = label_id;
                        // 레이블 이름은 수정하지 않는다
                        // settingInfo.label_name = formFields.label_name || results.label_name;
                        settingInfo.text = formFields.text || results.text;
                        settingInfo.genre_id = parseInt(formFields.genre_id) || results.genre_id;

                        if (files.image !== undefined) {
                            settingInfo.imagepath = files.image.path;
                        } else {
                            settingInfo.imagepath = results.dbImagePath;
                        }

                        // update start
                        // need_position 을 제외한 수정부터 진행
                        Label.updateLabel(settingInfo, function (err, result) {
                            // result 에는 update 된 row의 개수가 들어있다
                            if (err) {
                                if (files.image) {
                                    unlinkFile(files.image.path, function(unlinkerr, code){
                                        if (unlinkerr) {
                                            return next(unlinkerr);
                                        } else {
                                            return next(err);
                                        }
                                    });
                                } else {
                                    return next(err);
                                }
                            } else {
                                // 그다음 need_position 에대한 수정을 진행
                                // 먼저 need_position 이 수정 대상인지 살피고 수정 대상이면 tmpArr 에 수정 값들을 넣는다
                                if (formFields.need_position_id !== undefined) {
                                    // need_position_id 가 있다면 parseInt 해준다
                                    var tmpArr = [];
                                    async.each(formFields.need_position_id, function (item, done) {
                                        tmpArr.push(parseInt(item));
                                        done(null);
                                    }, function (err) {
                                        // done
                                        if (err) {
                                            // done(err) 발생하지 않는다
                                        } else {
                                            // tmpArr 에 need_position 값들이 들어갔다
                                            // showSettingLabelPage 에서도 need_position을 배열에 저장한다
                                            Label.updateLabelNeedPosition(results.need_position, tmpArr
                                                , label_id, function (err, result) {
                                                    if (err) {
                                                        return next(err);
                                                    } else {
                                                        res.send({
                                                            message: '레이블 수정에 성공했습니다',
                                                            resultCode: 1
                                                        });
                                                    }
                                                });
                                        }
                                    });

                                } else {
                                    // 수정할 need_position 이 없다면 수정 성공 메세지를 보낸다
                                    res.send({
                                        message: '레이블 수정에 성공했습니다',
                                        resultCode: 1
                                    });
                                }
                            }
                        });
                        // update end
                    }
                });
            }
        });
    }
});

router.delete('/:label_id', isSecure, isAuthenticate, function (req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});
    logger.log('debug', 'body: %j', req.body, {});

    var user_id = parseInt(req.body.user_id);
    var label_id = parseInt(req.params.label_id);
    var members = parseBoolean(req.query.members) || false;

    if (members) {
        Label.deleteMember(user_id, label_id, function (err, result) {
            if (err) {
                return next(err);
            } else {
                res.send({
                    message: '레이블에서 탈퇴되었습니다.'
                });
            }
        })
    } else {
        res.send({
            message: 'members 값을 넣으십시오'
        });
    }
});


module.exports = router;