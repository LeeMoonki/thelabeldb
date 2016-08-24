//dummy function
var dummyLabel = {};
dummyLabel.id = 1;
dummyLabel.name = 'NUGA';
dummyLabel.image_path = '/usr/desktop/didimdol1.jpg';
dummyLabel.need_genre = '발라드';
dummyLabel.need_position = '보컬';

function updateLabel(info, callback){
    var label = info;
    callback(null, label);
}

function showSettingLabelPage(info, callback){
    var label = info;
    callback(null, label);
}

function searchLabel(page, count, info, callback){
    var label = [];

    label.push({
        label_id: 11,
        label_name: '타인1',
        label_image_path: '/usr/desktop/asdqwe.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });
    label.push({
        label_id: 8,
        label_name: '타인2',
        label_image_path: '/usr/desktop/love.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });
    label.push({
        label_id: 15,
        label_name: '타인3',
        label_image_path: '/usr/desktop/sing.jpg',
        label_need_genre_id: info.genre,
        label_need_position_id: info.position,
        label_city_id: info.city,
        label_town_id: info.town
    });

    callback(null, label);
}

function labelList(callback) {
    if (label_name === undefined) {
        return callback(null, null);
    }
    else {
        var list = {};
        label.label_name = label_name;
        callback(null, label);
    }
    callback(null, label);
}

function findLabel(name, callback) {
    var list = {};
    list.name = dummyLabel.name;
    callback(null, list);
}


function dummyRegisterLabel(label, callback) {
    callback(null, true);
}

function labelPage(id, page, count, callback) {
    var list =
    {
        id: 1,
        label_name: 'nuga',
        image_path: '/usr/desktop/didimdol1.jpg',
        authorization: 'setting'
    };
    callback(null, list)

}

function dummylist(page, count, callback) {

    var listpg = {
        page: page,
        count: count,
        result: {
            id: 1,
            name: '래이블',
            image_page: '/usr/desktop/didimdol.jpg',
            genre: '발라드',
            need_position: '보컬'
        },
        member: [
            {
                user_id: 1,
                usdr_name: 'A',
                user_position: '피아노',
                user_imagepath: '/usr/desktop/didimdol1.jpg'
            },
            {
                user_id: 2,
                usdr_name: 'B',
                user_position: '드럼',
                user_imagepath: '/usr/desktop/didimdol2.jpg'
            }
        ],
        data: [{
            id: 1,
            user_id: 1,
            nickname: 'nnn',
            filetype: 0,
            file_path: '/usr/desktop/didimdol.mp3',
            date: '2016-08-23',
            like: 2
        },
            {
                id: 4,
                user_id: 1,
                nickname: 'nnn',
                filetype: 0,
                file_path: '/usr/desktop/didimdol2.mp3',
                date: '2016-08-23',
                like: 10
            }
        ]
    };
    callback(null, listpg);
}

// 레이블 구성멤버
function labelMember(callback) {
        var member =
            [
                {
                    user_id: 1,
                    user_name: '가나다',
                    image_path: '/usr/desktop/didimdol1.jpg'
                },
                {
                    user_id: 2,
                    user_name: '거너더',
                    image_path: '/usr/desktop/didimdol2.jpg'
                },
                {
                    user_id: 3,
                    user_name: '리미비',
                    image_path: '/usr/desktop/didimdol3.jpg'
                }
            ];
        callback(null, member);
}

//레이블 셋팅
// function labelSet( callback) {
//     var set =
//     callback(null );
// }

module.exports.labelList = labelList;
module.exports.dummyRegisterLabel = dummyRegisterLabel;
module.exports.dummylist = dummylist;
module.exports.dummyLabel = dummyLabel;
module.exports.labelPage = labelPage;
module.exports.labelMember = labelMember;
module.exports.searchLabel = searchLabel;
module.exports.showSettingLabelPage = showSettingLabelPage;
module.exports.updateLabel = updateLabel;
//module.exports.labelSet = labelSet;