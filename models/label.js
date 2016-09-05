//dummy function

var dummyLabel = {};
dummyLabel.id = 1;
dummyLabel.name = 'NUGA';
dummyLabel.image_path = '/usr/desktop/didimdol1.jpg';
dummyLabel.need_genre = '발라드';
dummyLabel.need_position = '보컬';

var mysql = require('mysql');
var async = require('async');
var path = require('path');
var url  = require('url');
var fs = require('fs');
var dbPool = require('../models/common').dbPool;
var hostAddress = require('../models/common').hostAddress;


function nameDupCheck(name, callback) {
    
    var sql_count_name = 'select count(id) count from label where name=? ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_count_name, [name], function(err, result){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, result[0].count);
                }
            });
        }
    });
    
}

function createLabel(info, callback) {

    var sql_insert_label = 'INSERT INTO `thelabeldb`.`label` (`name`, `genre_id`, `text`, ' +
                                       '`imagepath`, `authority_user_id`) ' +
    'VALUES (?, ?, ?, ?, ?)';

    var sql_insert_label_need = 'INSERT INTO `thelabeldb`.`label_need` (`label_id`, `position_id`) ' +
                                'VALUES (?, ?)';

    var sql_insert_label_member = 'INSERT INTO `thelabeldb`.`label_member` (`user_id`, `label_id`) ' +
                                  'VALUES (?, ?)';
    
    var labelInsertId = 0;
    var labelNeedInsertId = [];
    var labelMemberInsertId = 0;

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    async.waterfall([insertLabel, insertLabelNeed, insertLabelMember], function(err){
                        if (err) {
                            return dbConn.rollback(function(){
                                dbConn.release();
                                callback(err, 0);
                            });
                        } else {
                            dbConn.commit(function(){
                                dbConn.release();
                                // 생성 결과가 필요할 경우를 위한 데이터 입력
                                var shootResult = {};
                                shootResult.label_id = labelInsertId;
                                shootResult.need_ids = labelNeedInsertId;
                                callback(null, 1);
                            });
                        }
                    });
                }
            });
        }

        function insertLabel(callback) {
            dbConn.query(sql_insert_label, [info.label_name, info.genre_id, info.text,
            info.imagepath, info.authority_user_id], function(err, result){
                if (err) {
                    callback(err);
                } else {
                    // 생성한 label_id 를 기반으로 need_position_id 와 label_member를 insert한다
                    labelInsertId = result.insertId;
                    callback(null, result.insertId);
                }
            });
        }

        function insertLabelNeed(label_id, callback) {
            // position_id 가 복수개일 수 있으므로 async.each를 사용한다
            async.each(info.position_id, function(item, done){
                dbConn.query(sql_insert_label_need, [label_id, item], function(err, result){
                    if (err) {
                        done(err);
                    } else {
                        labelNeedInsertId.push(result.insertId);
                        done(null);
                    }
                });
            }, function(err){
                // done
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }

        function insertLabelMember(callback) {
            if (err) {
                callback(err);
            } else {
                dbConn.query(sql_insert_label_member, [info.authority_user_id, labelInsertId], function(err, result){
                    if (err) {
                        callback(err);
                    } else {
                        labelMemberInsertId = result.insertId;
                        callback(null);
                    }
                });
            }
        }

    });
}

function joinLabel(info, callback) {
    // info 정보를 통해 레이블에 가입한다
    var sql_insert_member = 'INSERT INTO `thelabeldb`.`label_member` (`user_id`, `label_id`) VALUES (?, ?) ';

    // label_member 에 저장된 id를 저장해둔다
    var insertId = 0;
    
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_insert_member, [info.user_id, info.label_id], function(err, result){
                        if (err) {
                            return dbConn.rollback(function(){
                                dbConn.release();
                                callback(err);
                            });
                        } else {
                            dbConn.commit(function(){
                                dbConn.release();
                                insertId = result.insertId;
                                callback(null, result.insertId);
                            });
                        }
                    });
                }
            });
        }
    });
}

function authorize(userId, labelId, callback) {

    var sql_update_authority = 'UPDATE `thelabeldb`.`label` SET `authority_user_id`=? WHERE `id`=? ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_update_authority, [userId, labelId], function(err, result){
                        if (err) {
                            return dbConn.rollback(function(){
                                dbConn.release();
                                callback(err);
                            });
                        } else {
                            dbConn.commit(function(){
                                dbConn.release();
                                callback(null);
                            });
                        }
                    });
                }
            });
        }
    });

}

function updateLabel(info, callback){
    
    var sql_update_label = 'UPDATE `thelabeldb`.`label` ' +
                           'SET `genre_id`=?, `text`=?, `imagepath`=? ' +
                           'WHERE `id`=?';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    dbConn.query(sql_update_label
                      , [info.genre_id, info.text, info.imagepath, info.label_id]
                      ,function(err, result){

                          if (err) {
                              return dbConn.rollback(function(){
                                  dbConn.release();
                                  callback(err);
                              });
                          } else {
                              dbConn.commit(function(){
                                  dbConn.release();
                                  callback(null, result.changedRows);
                              });
                          }
                      });
                }
            });
        }
    });
}

function updateLabelNeedPosition(oldPosition, newPosition, label_id, callback) {

    var sql_delete_need = 'DELETE FROM `thelabeldb`.`label_need` WHERE `id`=? ';
    var sql_update_need = 'UPDATE `thelabeldb`.`label_need` SET `position_id`=? WHERE `id`=? ';
    var sql_create_need = 'INSERT INTO `thelabeldb`.`label_need` (`label_id`, `position_id`) VALUES (?, ?) ';

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {

            dbConn.beginTransaction(function(err){
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    async.waterfall([deleteNeed, createNeed], function(err){
                        if (err) {
                            return dbConn.rollback(function(){
                                dbConn.release();
                                callback(err);
                            });
                        } else {
                            dbConn.commit(function(){
                                dbConn.release();
                                callback(null);
                            });
                        }
                    });
                }
            });
        }
        
        function deleteNeed(callback) {
            async.each(oldPosition, function(row, done){
                dbConn.query(sql_delete_need, [row.need_id], function(err, result){
                    if (err) {
                        done(err);
                    } else {
                        done(null);
                    }
                });
            }, function(err){
                // done
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }

        function createNeed(callback) {
            async.each(newPosition, function(item, done){
                dbConn.query(sql_create_need, [label_id, item], function(err, result){
                    if (err) {
                        done(err);
                    } else {
                        done(null);
                    }
                });
            }, function(err){
                // done
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }

        function updateNeed(positionId, needId, callback) {
            dbConn.query(sql_update_need, [positionId, needId], function(err, result){
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
        
    });
}

function showSettingLabelPage(labelId, type, callback){

    // type 0 : 프로토콜 정의서 대로 자료를 제공
    // type 1 : 수정을 위한 데이터를 제공 (label_need 의 id 를 제공)


    var sql_select_setting_info = 'select l.name label_name, l.text text, l.imagepath image_path, ' +
                                         'g.id genre_id, g.name genre, p.id position_id, p.name position, n.id nid ' +
                                  'from label l join genre g on(l.genre_id = g.id) ' +
                                               'join label_need n on(l.id = n.label_id) ' +
                                               'join position p on(n.position_id = p.id) ' +
                                  'where l.id = ?';


    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_select_setting_info, [labelId], function(err, results){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var label = {};
                    var filename = path.basename(results[0].image_path);
                    label.label_name = results[0].label_name;
                    label.text = results[0].text;
                    if (type === 1) {
                        label.dbImagePath = results[0].image_path;
                    }
                    label.image_path = url.resolve(hostAddress, '/labelProfiles/' + filename);
                    label.genre_id = results[0].genre_id;
                    label.genre = results[0].genre;
                    // async.each
                    var tmpArr = [];
                    async.each(results, function(row, done){
                        var tmpObj = {};
                        if (type === 1) {
                            tmpObj.need_id = row.nid;
                        }
                        tmpObj.id = row.position_id;
                        tmpObj.name = row.position;
                        tmpArr.push(tmpObj);
                        done(null);
                    }, function(err){
                        // done
                        if (err) {
                            // done(err) 발생하지 않음
                        } else {
                            label.need_position = tmpArr;
                            callback(null, label);
                        }
                    });
                }
            });
        }
    });

}



function labelMain(labelId, page, count, callback) {
    // result block
    var sql_select_label_info = 'select l.id id, l.name name, imagepath, g.name genre ' +
                                'from label l join genre g on(l.genre_id = g.id) ' +
                                'where l.id = ?';
    var sql_select_label_need = 'select name ' +
                                'from label_need n join position p on(n.position_id = p.id) ' +
                                'where label_id = ?';

    // member block
    var sql_select_member_info = 'select user_id, nickname user_nickname, p.name user_possition, imagepath user_imagepath ' +
                                 'from user u join label_member m on(u.id = m.user_id) ' +
                                             'join position p on(u.position_id = p.id) ' +
                                 'where label_id = ?';

    // data block
    var sql_select_posts = 'select p.id id, user_id, nickname, filetype, filepath file_path, p.ctime date, numlike ' +
                           'from post p join user u on(p.user_id = u.id) ' +
                           'where p.label_id = ? ' +
                           'limit ?, ?';

    var result = {};
    var members = [];
    var data = [];

    var memberResult = [];
    var postResult = [];

    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            async.waterfall([getLabelInfo, getLabelMember, getLabelPosts], function(err){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    var user = {};
                    // var member = {};
                    // var post = {};
                    user.page = page;
                    user.count = count;

                    user.result = result;
                    for (var i = 0; i < memberResult.length; i++) {
                        members.push(memberResult[i]);
                    }
                    for (var j = 0; j < postResult.length; j++) {
                        data.push(postResult[j]);
                    }
                    user.member = members;
                    user.data = data;
                    callback(null, user);
                }
            });
        }

        function getLabelInfo(callback) {
            dbConn.query(sql_select_label_info, [labelId], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_label_info'));
                } else {
                    var filename = path.basename(results[0].imagepath);
                    result.label_id = results[0].id;
                    result.label_name = results[0].name;
                    result.label_image_path = url.resolve(hostAddress, '/labelProfiles/' + filename);
                    result.label_genre = results[0].genre;
                    dbConn.query(sql_select_label_need, [labelId], function(err, needResults){
                        if (err) {
                            callback(new Error('Error sql_select_label_need'));
                        } else {
                            var need = [];
                            for (var i = 0; i < needResults.length; i++) {
                                need.push(needResults[i].name);
                            }
                            result.label_need_position = need;
                            callback(null);
                        }
                    });
                }
            });
        }

        function getLabelMember(callback) {
            dbConn.query(sql_select_member_info, [labelId], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_member_info'));
                } else {
                    memberResult = results;
                    callback(null);
                }
            });
        }


        function getLabelPosts(callback) {
            dbConn.query(sql_select_posts, [labelId, (page - 1) * count, count], function(err, results){
                if (err) {
                    callback(new Error('Error sql_select_posts'));
                } else {
                    postResult = results;
                    callback(null);
                }
            });
        }
    });
}


function labelPage(userId, callback) {

    var sql = 'select l.id id, l.name label_name, imagepath image_path, authority_user_id authorization ' +
              'from label l join label_member m on(l.id = m.label_id) ' +
              'where m.user_id = ?';

    var label_list = {};
    var label_page = [];

    dbPool.getConnection(function (err, dbConn) {
       if (err) {
           return callback(err);
       }
       dbConn.query(sql, [userId], function (err, results) {
           dbConn.release();
          if (err) {
              return callback (err);
          }
          else {
              if (results[0] === undefined) {
                  // 가입한 레이블이 없다면
                  callback(null, {});
              } else {
                  // 가입한 레이블이 있다면
                  async.each(results, function(row, done){
                      var tmp = {};
                      var filename = path.basename(row.image_path);
                      tmp.id = row.id;
                      tmp.label_name = row.label_name;
                      tmp.image_path = url.resolve(hostAddress, '/labelProfiles/' + filename);
                      tmp.authorization = row.authorization;
                      label_page.push(tmp);
                      done(null);
                  }, function(err){
                      //done
                      if (err) {
                          // done(err) 발생하지 않음
                      } else {
                          label_list.data = label_page;
                          callback(null, label_list);
                      }
                  });
              }
          }
       });
    });
}

function labelMember(label_id, callback) {
    var sql = 'select u.id user_id, u.nickname user_name, u.imagepath user_image_path ' +
              'from label l join label_member m on(l.id = m.label_id) ' +
                           'join user u on (m.user_id = u.id) ' +
              'where l.id = ?';

    var label_member = {};
    var member =[];

    dbPool.getConnection(function (err, dbConn) {

        if (err) {
            return callback (err);
        }
        dbConn.query(sql, [label_id], function (err, results) {
            dbConn.release();
            if (err) {
                return callback (err);
            }
            else {
                async.each(results, function(row, done){
                    var tmp = {};
                    var filename = path.basename(row.user_image_path);
                    tmp.user_id = row.user_id;
                    tmp.user_name = row.user_name;
                    tmp.user_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                    member.push(tmp);
                    done(null);
                }, function(err){
                    // done
                    if (err) {
                        // done(err) 발생하지 않음
                    } else {
                        label_member.data = member;
                        callback(null, label_member);
                    }
                });
            }
        });
    });
}

function getLabelSearchInfo(labelId, callback) {
    var sql_find_ids = 'select l.genre_id genre_id, n.position_id position_id ' +
                       'from label l join label_need n on(l.id = n.label_id) ' +
                       'where l.id = ?';
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_find_ids, [labelId], function(err, results){
                dbConn.release();
                if (err) {
                    callback(new Error('Error sql_find_ids'));
                } else {
                    var info = {};
                    var pos = [];
                    info.genre_id = results[0].genre_id;
                    for (var i = 0; i < results.length; i++) {
                        pos.push(results[i].position_id);
                    }
                    info.position_id = pos;

                    callback(null, info);
                }
            });
        }
    });
}

function getLabelSearchInfoArr(labelIds, callback){
    var sql_find_ids = 'select l.genre_id genre_id, n.position_id position_id ' +
                       'from label l join label_need n on(l.id = n.label_id) ' +
                       'where l.id = ?';

    var infos = [];
    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            // 여기에서 oneLabel 과 tmpArr 을 정의해서 쓸 경우 infos에서 이들을 참조하므로
            // 앞으로 값을 바꿀 때마다 infos를 건드리지 않아도 infos의 정보가 바뀐다
            async.each(labelIds, function(label_id, done){
                dbConn.query(sql_find_ids, [label_id], function(err, results){
                    if (err) {
                        done(err);
                    } else {
                        var tmpArr = [];
                        var oneLabel = {};
                        oneLabel.genre_id = results[0].genre_id;
                        async.each(results, function(item, next){
                            tmpArr.push(item.position_id);
                            next(null);
                        }, function(err){
                            // next callback
                            if (err) {
                                done(err);
                            } else {
                                oneLabel.position_id = tmpArr;
                                infos.push(oneLabel);
                                done(null);
                            }
                        });
                    }
                });
            }, function(err){
                // done callback
                if (err) {
                    dbConn.release();
                    return callback(err);
                } else {
                    callback(null, infos);
                }
            });
        }
    });
}


function searchLabel(label_ids, page, count, info, callback){


    var sql_search_both = 'select l.id label_id, l.name label_name, imagepath label_image_path, ' +
                                 'g.name label_genre, p.name label_need_position ' +
                          'from label l join label_need n on(l.id = n.label_id) ' +
                                       'join genre g on(l.genre_id = g.id) ' +
                                       'join position p on(n.position_id = p.id) ' +
                          'where l.genre_id = ? and n.position_id = ? ' +
                          'limit ?';

    var sql_search_genre = 'select l.id label_id, l.name label_name, imagepath label_image_path, ' +
                                  'g.name label_genre, p.name label_need_position ' +
                           'from label l join label_need n on(l.id = n.label_id) ' +
                                        'join genre g on(l.genre_id = g.id) ' +
                                        'join position p on(n.position_id = p.id) ' +
                           'where l.genre_id = ? ' +
                           'limit ?';

    var sql_search_position = 'select l.id label_id, l.name label_name, imagepath label_image_path, ' +
                                     'g.name label_genre, p.name label_need_position ' +
                              'from label l join label_need n on(l.id = n.label_id) ' +
                                           'join genre g on(l.genre_id = g.id) ' +
                                           'join position p on(n.position_id = p.id) ' +
                              'where n.position_id = ? ' +
                              'limit ?';

    // 이미 검색된 사용자를 검색 결과에서 지우기 위해
    var alreadySearchedIndex = label_ids;

    var maxCount = page * count; // 이번 검색으로 뽑아야할 검색 개수
    var totalResults = []; // 검색 결과를 저장


    dbPool.getConnection(function(err, dbConn){
        if (err) {
            return callback(err);
        } else {
            // start search
            async.waterfall([searchBoth, searchGenre, searchPosition], function(err){
                dbConn.release();
                if (err) {
                    return callback(err);
                } else {
                    callback(null, totalResults);
                }
            });
        }

        function searchBoth(callback) {
            dbConn.query(sql_search_both, [info.genre_id, info.position_id, maxCount], function(err, results){
                if (err) {
                    callback(err);
                } else {
                    async.each(results, function(row, done){
                        findAlreadyIndex(alreadySearchedIndex, row.label_id, function(flag){
                            if (!flag) {
                                var tmp = {};
                                var filename = path.basename(row.label_image_path);
                                tmp.label_id = row.label_id;
                                tmp.label_name = row.label_name;
                                tmp.label_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                tmp.label_genre = row.label_genre;
                                tmp.label_need_position = row.label_need_position;
                                totalResults.push(tmp);
                                alreadySearchedIndex.push(row.label_id);
                            }
                        });
                        done(null);
                    }, function(err){
                        // done
                        if (err) {
                            // done(err) 발생하지 않음
                        } else {
                            if (totalResults.length < maxCount) {
                                callback(null, true);
                            } else {
                                callback(null, false);
                            }
                        }
                    });
                }
            });
        }

        function searchGenre(flag, callback) {
            if (!flag) {
                callback(null, false);
            } else {
                dbConn.query(sql_search_genre, [info.genre_id, maxCount], function(err, results){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(results, function(row, done){
                            findAlreadyIndex(alreadySearchedIndex, row.label_id, function(flag){
                                if (!flag) {
                                    var tmp = {};
                                    var filename = path.basename(row.label_image_path);
                                    tmp.label_id = row.label_id;
                                    tmp.label_name = row.label_name;
                                    tmp.label_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                    tmp.label_genre = row.label_genre;
                                    tmp.label_need_position = row.label_need_position;
                                    totalResults.push(tmp);
                                    alreadySearchedIndex.push(row.label_id);
                                }
                            });
                            done(null);
                        }, function(err){
                            // done
                            if (err) {
                                // done(err) 발생하지 않음
                            } else {
                                if (totalResults.length < maxCount) {
                                    callback(null, true);
                                } else {
                                    callback(null, false);
                                }
                            }
                        });
                    }
                });
            }
        }

        function searchPosition(flag, callback) {
            if (!flag) {
                callback(null, false);
            } else {
                dbConn.query(sql_search_position, [info.position_id, maxCount], function(err, results){
                    if (err) {
                        callback(err);
                    } else {
                        async.each(results, function(row, done){
                            findAlreadyIndex(alreadySearchedIndex, row.label_id, function(flag){
                                if (!flag) {
                                    var tmp = {};
                                    var filename = path.basename(row.label_image_path);
                                    tmp.label_id = row.label_id;
                                    tmp.label_name = row.label_name;
                                    tmp.label_image_path = url.resolve(hostAddress, '/userProfiles/' + filename);
                                    tmp.label_genre = row.label_genre;
                                    tmp.label_need_position = row.label_need_position;
                                    totalResults.push(tmp);
                                    alreadySearchedIndex.push(row.label_id);
                                }
                            });
                            done(null);
                        }, function(err){
                            // done
                            if (err) {
                                // done(err) 발생하지 않음
                            } else {
                                if (totalResults.length < maxCount) {
                                    callback(null, true);
                                } else {
                                    callback(null, false);
                                }
                            }
                        });
                    }
                });
            }
        }

    });
}

function findAlreadyIndex(indexArr, index, callback) {
    var length = indexArr.length;
    var flag = false;
    for (var i = 0; i < length; i++) {
        if (indexArr[i] === index) {
            flag = true;
            break;
        }
    }
    callback(flag);
}

//레이블 탈퇴 models
function deleteMember(id, callback) {
// function deleteMember(user_id, label_id, callback) {
    // var sql_delete = 'DELETE FROM `thelabeldb`.`label_member` ' +
    //     'WHERE user_id= ? and label_id= ?';

    var sql_delete = 'DELETE FROM `thelabeldb`.`message WHERE id= ?';

    var sql_authority_user = 'select authority_user_id from label where id =?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        }
        dbConn.beginTransaction(function (err) {
            if (err) {
                dbConn.release();
                return callback(err);
            }

            async.waterfall([memberDelete, authorityUser], function (err) {
                if (err) {
                    return dbConn.rollback(function () {
                        dbConn.release();
                        callback(err);
                    });
                }
                dbConn.commit(function () {
                    dbConn.release();
                    callback(null);
                })
            });
        });

        function memberDelete(callback) {
            dbConn.query(sql_delete, [], function (err, result) {
                if (err) {
                    return callback (err);
                }
                else {

                }
            });
        }

        function authorityUser(callback) {
            dbConn.query(sql_authority_user, [], function (err, result) {
                if (err) {
                    return callback (err);
                }
                else {

                }
            });
        }
    });
}



//레이블 탈퇴 GET 권한 유저
function get_deleteMember(label_id, user_id, callback) {

    var sql_delete = 'SELECT l.id, l.authority_user_id, lm.user_id ' +
      'FROM label l join label_member lm on (lm.label_id = l.id) ' +
      'where label_id = ?';

    var sql_me = 'SELECT l.id, l.authority_user_id, lm.user_id ' +
      'FROM label l join label_member lm on (lm.label_id = l.id) ' +
      'where label_id = ? and user_id = ?';

    var totalMember = [];
    var myProfile = [];

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback(err);
        } else {
            dbConn.query(sql_delete, [label_id, user_id], function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    console.log(myProfile);
                    async.each(result, function (item, done) {
                        totalMember.push(item.user_id);
                        done(null);
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }
                        else {
                            findAlreadyIndex(totalMember, user_id, function (flag) {
                                if (flag) {                     // 레이블의 멤버라면
                                    if (totalMember.authority_user_id === user_id) {
                                        callback(null, totalMember); // 레이블 멤버 전원 출력
                                    }
                                }
                                else {
                                    callback(null, {message: '레이블에 관한 권한이 없습니다.'})
                                }
                            });
                        }
                    });
                }
            });

            async.waterfall([selectDelete, meDelete], function (err) {
                dbConn.release();
                if (err) {
                    return callback(err);
                }
                else {
                    var label_member = {};

                    label_member.data = totalMember;
                    label_member.me = myProfile;

                    if (label_member.data.authority_user_id === label_member.user_id) {
                        callback(null, label_member.data);
                    } else if (label_member.data.authority_user_id !== label_member.user_id) {
                        callback(null, label_member.me);
                    }
                }
            });

            function selectDelete(callback) {
                dbConn.query(sql_delete, [label_id], function (err, results) {
                    if (err) {
                        return callback(err);
                    } else {
                        totalMember = results;
                        callback(null);
                    }
                });
            }

            function meDelete(callback) {
                dbConn.query(sql_me, [label_id, user_id], function (err, results) {
                    if (err) {
                        return callback(err);
                    } else {
                        myProfile = results;
                        callback(null);
                    }
                });
            }
        }
    });
}

// function get_deleteMember(label_id, callback) {
//     var sql = 'SELECT l.id, l.authority_user_id, lm.user_id ' +
//         'FROM label l join label_member lm on (lm.label_id = l.id) ' +
//         'where label_id = ?';
//
//     dbPool.getConnection(function (err, dbConn) {
//        if (err) {
//            return callback (err);
//        } else {
//            dbConn.query(sql, [label_id], function (err, results) {
//               dbConn.release();
//               if (err) {
//                   return callback (err);
//               } else {
//                   callback (null, results);
//               }
//            });
//        }
//     });
// }

//레이블 탈퇴 GET 권한없는 유저
function get_myprofile(label_id, user_id, callback) {

    var sql = 'SELECT l.id, l.authority_user_id, lm.user_id ' +
      'FROM label l join label_member lm on (lm.label_id = l.id) ' +
      'where label_id = ? and user_id = ?';

    dbPool.getConnection(function (err, dbConn) {
        if (err) {
            return callback (err);
        } else {
            dbConn.query(sql, [label_id, user_id], function (err, results) {
                dbConn.release();
                if (err) {
                    return callback (err);
                }
                else {
                    callback(null, results);
                }
            });
        }
    });
}





module.exports.nameDupCheck = nameDupCheck;
module.exports.createLabel = createLabel;
module.exports.joinLabel = joinLabel;

module.exports.authorize = authorize;
module.exports.showSettingLabelPage = showSettingLabelPage;
module.exports.updateLabel = updateLabel;
module.exports.updateLabelNeedPosition = updateLabelNeedPosition;

module.exports.labelMain = labelMain;
module.exports.labelPage = labelPage;
module.exports.labelMember = labelMember;
module.exports.deleteMember = deleteMember;

module.exports.searchLabel = searchLabel;
module.exports.getLabelSearchInfo = getLabelSearchInfo;
module.exports.getLabelSearchInfoArr = getLabelSearchInfoArr;



module.exports.get_deleteMember = get_deleteMember;
module.exports.get_myprofile = get_myprofile;