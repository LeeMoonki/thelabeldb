// dummy data
var dummyTotalMessages = [];
var dummyMessages = [];

dummyTotalMessages.push({
  sender_user_id: 2,
  sender_user_nickname: '닉네임2',
  sender_user_image_path: 'beautiful.jpg',
  last_update_time: '2016-08-23 08:00'
});
dummyTotalMessages.push({
  sender_user_id: 3,
  sender_user_nickname: '닉네임3',
  sender_user_image_path: 'angry.jpg',
  last_update_time: '2016-08-22 08:00'
});

dummyMessages.push({
  sender_user_id: 2,
  sender_user_nickname: '닉네임2',
  sender_user_image_path: 'beautiful.jpg',
  update_time: '2016-08-23 08:00',
  message: 'hihihihihihihihi'
});

dummyMessages.push({
  sender_user_id: 3,
  sender_user_nickname: '닉네임3',
  sender_user_image_path: 'angry.jpg',
  update_time: '2016-08-22 08:00',
  message: 'hellow'
});


function dummyShowTotalMessage(userId, page, count, callback){
  callback(null, dummyTotalMessages);
}

function dummyShowMessage(userId, youId, page, count, callback){
  var messages = [];
  var leng = dummyMessages.length;

  // dummyMessages 에서 sender_user_id 가 youId 와 같은 것만 뽑으려 했지만
  // if 문이 말을 안 들어서 일단 통째로 넣기로 함
  for (var i = 0; i < leng; i++){
    messages.push(dummyMessages[i]);
  }
  callback(null, messages);
}

function dummySnedMessage(userId, youId, message, callback){
  dummyTotalMessages.push({
    sender_user_id: youId,
    sender_user_nickname: '닉네임4',
    sender_user_image_path: 'angry.jpg',
    last_update_time: '2016-08-22 08:00'
  });

  dummyMessages.push({
    sender_user_id: youId,
    sender_user_nickname: '닉네임4',
    sender_user_image_path: 'beautiful.jpg',
    update_time: '2016-08-23 08:00',
    message: message
  });
  callback(null, true);
}

module.exports.dummyShowTotalMessage = dummyShowTotalMessage;
module.exports.dummyShowMessage = dummyShowMessage;
module.exports.dummySnedMessage = dummySnedMessage;