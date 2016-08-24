// dummy data

var dummyMeetPosts = [];
var dummyPosts = [];

dummyMeetPosts.push({
  id: 2,
  label_id: 1,
  nickname: '닉네임1',
  filetype: 0,
  file_path: '/usr/desktop/qwedfd.mp3',
  date: '2016-07-03',
  like: 5
});
dummyMeetPosts.push({
  id: 3,
  label_id: 7,
  nickname: '닉네임3',
  filetype: 0,
  file_path: '/usr/desktop/didimdol.mp3',
  date: '2016-06-23',
  like: 34
});
dummyMeetPosts.push({
  id: 9,
  label_id: 2,
  nickname: '닉네임2',
  filetype: 0,
  file_path: '/usr/desktop/lake.mp3',
  date: '2016-08-11',
  like: 9
});


dummyPosts.push({
  id: 11,
  label_id: 1,
  nickname: '닉네임8',
  filetype: 1,
  file_path: '/usr/desktop/didimdol2.jpg',
  date: '2016-08-23',
  like: 3
});
dummyPosts.push({
  id: 4,
  label_id: 1,
  nickname: '닉네임4',
  filetype: 0,
  file_path: '/usr/desktop/didimdol2.mp3',
  date: '2016-08-23',
  like: 3
});
dummyPosts.push({
  id: 17,
  label_id: 1,
  nickname: '닉네임11',
  filetype: 0,
  file_path: '/usr/desktop/didimdol2.mp3',
  date: '2016-08-23',
  like: 3
});
dummyPosts.push({
  id: 19,
  label_id: 1,
  nickname: '닉네임10',
  filetype: 0,
  file_path: '/usr/desktop/didimdol2.mp3',
  date: '2016-08-23',
  like: 3
});


function dummyShowPosts(page, count, meet, callback){
  
  var meetdata = [];
  var data = [];
  
  for (var i = 0; i < meet; i++){
    meetdata.push(dummyMeetPosts[i]);
  }
  data = dummyPosts;
  callback(null, meetdata, data);
}

function dummyUploadPost(postInfo, callback){
  dummyPosts.push({
    id: 100,
    user_id: postInfo.id,
    nickname: postInfo.nickname,
    filetype: postInfo.filetype,
    file_path: postInfo.file_path,
    date: '2016-08-24',
    like: 0
  });
  callback(null, true);
}





module.exports.dummyShowPosts = dummyShowPosts;
module.exports.dummyUploadPost = dummyUploadPost;