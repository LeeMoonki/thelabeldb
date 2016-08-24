//더미 data
var dummyUser = {};

dummyUser.dummy_email = 'abcd@naver.com';
dummyUser.dummy_password = '1234';
dummyUser.dummy_id = 1;
dummyUser.dummy_nickname = '닉네임';
dummyUser.dummy_gender = '남자';
dummyUser.dummy_position = '보컬';
dummyUser.dummy_genre = '발라드';
dummyUser.dummy_city = '서울';
dummyUser.dummy_town = '관악구';


function findByEmail(email, callback) {
    // if (err) {
    //     return callback(err);
    // }
    if (email === undefined) {
        return callback(null, null);
    }
    else {
        var user = {};
        user.id = dummyUser.dummy_id;
        user.nickname = dummyUser.dummy_nickname;
        user.email = email;
        user.password = dummyUser.dummy_password;
        callback(null, user);
    }
}

function verifyPassword(password, storedpassword, callback) {
    // if (err) {
    //     return callback(err);
    // }
    storedpassword = dummyUser.dummy_password;
    if (password !== storedpassword) {
        return callback(null, false);
    }
    else {
        callback(null, true);
    }
}

function  findUser(userId, callback) {
    var user = {};
    user.id = dummyUser.dummy_id;
    user.nickname = dummyUser.dummy_nickname;
    user.email = dummyUser.dummy_email;
    user.gender = dummyUser.dummy_gender;
    user.position = dummyUser.dummy_position;
    user.genre = dummyUser.dummy_genre;
    user.city = dummyUser.dummy_city;
    user.town = dummyUser.dummy_town;
    callback(null, user);
}




// models showing JSON data for dummy test
function dummyShowMe(page, count, callback){
  
  var user = {
    page: page,
    count: count,
    result: {
      id: dummyUser.dummy_id,
      nickname: dummyUser.dummy_nickname,
      image_page: '/usr/desktop/didimdol.jpg',
      genre: dummyUser.dummy_genre,
      post_count: 2,
      data: [
        {
          id: 2,
          user_id: dummyUser.dummy_id,
          nickname: dummyUser.dummy_nickname,
          filetype: 0,
          file_path: '/usr/desktop/didimdol.mp3',
          date: '2016-08-23',
          like: 3
        },
        {
          id: 5,
          user_id: dummyUser.dummy_id,
          nickname: dummyUser.dummy_nickname,
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

function dummyShowProfilePage(callback){
  var user = {};
  user.id = dummyUser.dummy_id;
  user.email = dummyUser.dummy_email;
  user.nickname = dummyUser.dummy_nickname;
  user.gender = dummyUser.dummy_gender;
  user.position = dummyUser.dummy_position;
  user.genre = dummyUser.dummy_genre;
  user.city = dummyUser.dummy_city;
  user.town = dummyUser.dummy_town;

  callback(null, user);
}

function dummySearchUsers(page, count, info, callback){
  var user = [];

  user.push({
    user_id: 11,
    user_nickname: '타인1',
    user_image_path: '/usr/desktop/asdqwe.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });
  user.push({
    user_id: 8,
    user_nickname: '타인2',
    user_image_path: '/usr/desktop/love.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });
  user.push({
    user_id: 15,
    user_nickname: '타인3',
    user_image_path: '/usr/desktop/sing.jpg',
    user_genre_id: info.genre,
    user_position_id: info.position,
    user_city_id: info.city,
    user_town_id: info.town
  });

  callback(null, user);
}

function dummyRegisterUser(user, callback){

  callback(null, true);

}

function dummyUpdateUser(user, callback){

  callback(null, true);

}

function dummyUpdatePassword(userId, password, newPassword, callback){
  // userId 를 통해 기존 password를 찾아 받은 password와 비교해야 한다
  if (dummyUser.dummy_password !== password) {
    callback(new Error('기존 비밀번호를 다르게 입력했습니다'), false);
  } else {
    dummyUser.dummy_password = newPassword;
    callback(null, true);
  }
}

module.exports.findByEmail = findByEmail;
module.exports.verifyPassword = verifyPassword;
module.exports.findUser = findUser;

// models showing JSON data for dummy test
module.exports.dummyShowMe = dummyShowMe;
module.exports.dummyShowOther = dummyShowOther;
module.exports.dummyRegisterUser = dummyRegisterUser;
module.exports.dummyShowProfilePage = dummyShowProfilePage;
module.exports.dummyUpdateUser = dummyUpdateUser;
module.exports.dummyUpdatePassword = dummyUpdatePassword;
module.exports.dummySearchUsers = dummySearchUsers;
module.exports.dummyUser = dummyUser;