var winston = require('winston');
var DailyRotateFile = require('winston-daily-rotate-file');
var path = require('path');
var moment = require('moment-timezone');
var timeZone = "Asia/Seoul";

var logger = new winston.Logger({
    // console 로 내보내는 transport 하나
    transports: [
        new winston.transports.Console({
            level: 'debug',
            silent: false,
            colorize: true,
            prettyPrint: true,
            timestamp: false
        }),
        new winston.transports.DailyRotateFile({
            level: 'debug',
            silent: false,
            colorize: false,
            prettyPrint: true,
            timestamp: function() {
                return moment().tz(timeZone).format();
            },
            dirname: path.join(__dirname, '../logs'),
            filename: 'debug_logs_',
            datePattern: 'yyyy-MM-ddTHH.log',
            maxsize: 1024 * 1024,
            json: false
        })
    ],
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            level: "debug",
            silent: false,
            colorize: false,
            prettyPrint: true,
            timestamp: function() {
                return moment().tz(timeZone).format();
            },
            dirname: path.join(__dirname, '../logs'),
            filename: 'exception_logs_',
            datePattern: 'yyyy-MM-ddTHH.log',
            maxsize: 1024,
            json: false,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: false
});



function isAuthenticate(req, res, next) {

    // log 생성
    logger.log('debug', '%s %s://%s%s', req.method, req.protocol, req.headers['host'], req.originalUrl);
    logger.log('debug', 'query: %j', req.query, {});
    
    var dup = parseBoolean(req.query.dup) || false;
    var setting = parseBoolean(req.query.setting) || false;
    var search = parseBoolean(req.query.search) || false;
    if (!req.user) {
        // 회원가입 체크
        if (dup) {
            if (setting || search) {
                // 중복 검사 정보 외에 다른 정보를 로그인 하지 않고 조회하려 할 경우
                return res.status(401).send({
                    message: 'login required'
                });
            } else {
                if (req.query.email && req.query.nickname) {
                    // 두 개를 동시에 중복검사 하려 할 경우
                    return res.status(401).send({
                        message: 'you can do duplicate test for only one condition'
                    });
                } else if (!req.query.email && !req.query.nickname) {
                    // 중복 검사 정보를 하나도 넣지 않고 중복검사하려 할 경우
                    return res.status(401).send({
                        message: 'need email or nickname information'
                    });
                } else {
                    next();
                }
            }
        } else {
            return res.status(401).send({
                message: 'login required'
            });
        }
    } else {
        // 수정 체크
        if (dup) {
            if (setting || search) {
                // 중복 검사 정보 외에 다른 정보를 중복검사와 함께 조회하려 할 경우
                return res.status(401).send({
                    message: 'you can get only one information'
                });
            } else {
                var nickname = req.query.nickname;
                var label_name = req.query.label_name;
                if (req.query.email) {
                    // 이메일 중복검사를 하려고 할 경우 
                    return res.status(401).send({
                        message: 'you cant modify email'
                    });
                } else if (!nickname && !label_name) {
                    // 중복 검사 정보를 넣지 않고 중복검사하려 할 경우
                    return res.status(401).send({
                        message: 'need name information'
                    });
                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
}

//https 아니면 돌려보내는함수
function isSecure(req, res, next) {
    if (!req.secure) {
        return res.status(426).send({
            message: 'https upgrade required'
        })
    }
    next();
}

function parseBoolean(requestQuery){
    if (requestQuery === 'true') {
        return true;
    } else {
        return false;
    }
}


module.exports.isAuthenticate = isAuthenticate;
module.exports.isSecure = isSecure;
module.exports.parseBoolean = parseBoolean;
module.exports.logger = logger;