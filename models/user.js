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




// models showing JSON data for dummy test
function dummyShowMe(page, count, callback){
  
  var user = {
    page: page,
    count: count,
    result: {
      id: 1,
      nickname: '닉네임',
      image_page: '/usr/desktop/didimdol.jpg',
      genre: '발라드',
      post_count: 2,
      data: [
        {
          id: 2,
          user_id: 1,
          nickname: '닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol.mp3',
          date: '2016-08-23',
          like: 3
        },
        {
          id: 5,
          user_id: 1,
          nickname: '닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol2.mp3',
          date: '2016-08-23',
          like: 0
        }
      ]
    }
  };
  
  callback(null, user);
}

function dummyShowOther(id, page, count, callback){
  
  var user = {
    page: page,
    count: count,
    result: {
      id: id,
      nickname: '다른 계정 닉네임',
      image_page: '/usr/desktop/didimdol.jpg',
      genre: '발라드',
      post_count: 2,
      data: [
        {
          id: 1,
          user_id: id,
          nickname: '다른 계정 닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol.mp3',
          date: '2016-08-23',
          like: 2
        },
        {
          id: 4,
          user_id: id,
          nickname: '다른 계정 닉네임',
          filetype: 0,
          file_path: '/usr/desktop/didimdol2.mp3',
          date: '2016-08-23',
          like: 10
        }
      ]
    }
  };
  
  callback(null, user);
}

function dummyRegisterUser(user, callback){

  callback(null, true);

}

module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findUser = findUser;

// models showing JSON data for dummy test
module.exports.dummyShowMe = dummyShowMe;
module.exports.dummyShowOther = dummyShowOther;
module.exports.dummyRegisterUser = dummyRegisterUser;