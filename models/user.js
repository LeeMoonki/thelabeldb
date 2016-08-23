//더미 이메일 패스워드
var dummy_email = 'abcd@naver.com';
var dummy_password = '1234';
var dummy_id = 1;


function findByEmail(email, callback) {
    // if (err) {
    //     return callback(err);
    // }
    if (email === undefined) {
        return callback(null, null);
    }
    else {
        var user = {};
        user.id = 1;
        user.name = 'thelabel';
        user.email = email;
        user.password = dummy_password;
        callback(null, user);
    }
}

function verifyPassword(password, storedpassword, callback) {
    // if (err) {
    //     return callback(err);
    // }
    storedpassword = dummy_password;
    if (password !== storedpassword) {
        return callback(null, false);
    }
    else {
        callback(null, true);
    }
}

function  findUser(userId, callback) {
    var user = {};
    user.id = dummy_id;
    user.name = 'thelabel';
    user.email = dummy_email;
    callback(null, user);
}

module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findUser = findUser;