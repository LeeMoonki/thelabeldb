var express = require('express');
var router = express.Router();
var Alarm = require('../models/alarm');

var fcm = require('node-gcm');
var logger = require('./common').logger;
var async = require('async');

var isAuthenticate = require('./common').isAuthenticate;
var isSecure = require('./common').isSecure;

/* GET users listing. */
router.get('/:label_id', isAuthenticate, isSecure, function (req, res, next) {
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    var to_id = parseInt(req.query.user_id);
    var label_id = parseInt(req.params.label_id);
    var from_id = req.user.id;

    Alarm.findMessage(from_id, label_id, function (err, results) {
        if (err) {
            return next(err);
        } else {
            res.send({
                message: results
            });
        }
    });
})

router.post('/label_id', isAuthenticate, isSecure, function(req, res, next){
    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'body: %j', req.body, {});

    if (!req.body.user_id || !req.body.label_id) {
        res.send({
            message: 'to_id와 label_id는 필수 정보 입니다'
        });
    } else {

        var to_id = parseInt(req.body.user_id);
        var label_id = parseInt(req.body.label_id);
        var from_id = req.user.id;
        var type = parseInt(req.body.type) || 0;

        Alarm.insertAlarm(from_id, to_id, label_id, type, function(err, result){
            if (err) {
                return next(err);
            } else {

                Alarm.getRegID(to_id, function (err, regId) {

                    if (err) {
                        return next(err);
                    } else {
                        var tokens = [];
                        tokens.push(regId);

                        var message = new fcm.Message({
                            data: {
                                from_id: from_id,
                                to_id: to_id,
                                label_id: label_id,
                                type: type
                            }
                            // ,
                            // notification: {
                            //   title: 'message wattdda',
                            //   body: 'quickly read it!!'
                            // }
                        });

                        // var message = new fcm.Message({
                        //   data: {
                        //     key1: 'value1',
                        //     key2: 'value2'
                        //   },
                        //   notification: {
                        //     title: '',
                        //     icon: '',
                        //     body: ''
                        //   }
                        // });

                        // 내 FireBase
                        // var sender = new fcm.Sender('AIzaSyCylDbj-lZc9FIDZaJrKe06bCSFp1WQvpU');


                        var sender = new fcm.Sender('AIzaSyB7amTJpCeivleEGbX2rGNPna97eROPwFI');

                        sender.send(message, tokens, function (err, response) {
                            if (err) {
                                return next(err);
                            }
                            res.send(response);
                        });
                    }
                });
            }
        });
    }
});

router.put('/:label_id', isSecure, isAuthenticate, function(req, res, next) {
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});

    var type = parseInt(req.body.type);
    var from_id = parseInt(req.body.from_id);
    var label_id = parseInt(req.params.label_id);
    var message = '';

    async.series([function (callback) {
        Alarm.decision(type, from_id, label_id, function (err, result) {
            if(err) {
                return callback(err);
            }
            callback(null);
        });
    }, function (callback) {
        Alarm.findMessage(from_id, label_id, function (err, result) {
            if(err) {
                return callback(err);
            } else {
                console.log('result1 : '+result);
                console.log('result2 : '+result[0].type);
                if (result[0].type === 1) {
                    Alarm.labelJoin(from_id, label_id, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    });
                } else if (result[0].type === 2) {
                    Alarm.refuse(from_id, label_id, type, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null);
                    })
                }
            }
        })
    }, function (callback) {
        Alarm.findMessage(from_id, label_id, function (err, result) {
            if(err) {
                return callback(err);
            } else{
                if(result[0].type === 1) {
                    Alarm.refuse(from_id, label_id, function (err, result) {
                        if(err) {
                            return callback(err);
                        }
                    });
                }
                callback(null);
            }
        })
    }], function (err) {
        if(err) {
            return next(err)
        }
        console.log(type);
        if(type ===1) message = '가입을 승인하였습니다.';
        else if(type ===2 ) {
            console.log(1234);
        } message= '가입요청이 거절당하였습니다.';
        res.send({message: message});
    });
});

module.exports = router;