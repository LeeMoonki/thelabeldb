

function isAuthenticate(req, res, next) {
    var dup = parseBoolean(req.query.dup) || false;
    var setting = parseBoolean(req.query.setting) || false;
    var search = parseBoolean(req.query.search) || false;
    if (!req.user) {
        // 회원가입 체크
        if (dup) {
            if (setting || search || req.query.id) {
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
            if (setting || search || req.query.id) {
                // 중복 검사 정보 외에 다른 정보를 중복검사와 함께 조회하려 할 경우
                return res.status(401).send({
                    message: 'login required'
                });
            } else {
                if (req.query.email) {
                    // 이메일 중복검사를 하려고 할 경우 
                    return res.status(401).send({
                        message: 'you cant modify email'
                    });
                } else if (!req.query.nickname) {
                    // 중복 검사 정보를 넣지 않고 중복검사하려 할 경우
                    return res.status(401).send({
                        message: 'need email or nickname information'
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