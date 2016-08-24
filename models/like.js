// dummy data
var dummyLike = [];

dummyLike.push({
  id: 9,
  user_id: 3,
  nickname: '닉네임23',
  filetype: 0,
  file_path: '/usr/desktop/didimdol2.mp3',
  date: '2016-08-23',
  like: 3
});

dummyLike.push({
  id: 8,
  user_id: 8,
  nickname: '닉네임10',
  filetype: 0,
  file_path: '/usr/desktop/mdol2.mp3',
  date: '2016-08-23',
  like: 2
});

dummyLike.push({
  id: 5,
  user_id: 3,
  nickname: '닉네임7',
  filetype: 0,
  file_path: '/usr/desktop/didim.mp3',
  date: '2016-08-23',
  like: 10
});



function dummyShowLikePosts(userId, page, count, callback){
  callback(null, dummyLike);
}

module.exports.dummyShowLikePosts = dummyShowLikePosts;