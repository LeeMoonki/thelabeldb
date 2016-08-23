function isAuthenticate(req, res, next) {
    if (!req.user) {
        return res.status(401).send({
            message: 'login required'
        });
    }
    next();
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

module.exports.isAuthenticate = isAuthenticate;
module.exports.isSecure = isSecure;