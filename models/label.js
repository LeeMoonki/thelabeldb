//dummy function
var dummy_name = 'NUGA';

function labelList(label_name, callback) {
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

function  findLabel(name, callback) {
    var list = {};
    list.name = dummy_name;
    callback(null, list);
}


function dummyRegisterLabel(label, callback){

    callback(null, true);

}


module.exports.labelList = labelList;
module.exports.dummyRegisterLabel = dummyRegisterLabel;