var express = require('express');
var router = express.Router();

var Alarm = require('../models/alarm');

/* GET users listing. */
router.get('/', function(req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;

    res.send({
        message: "get alarm",
        page: page,
        count: count
    });

});

router.post('/', function (req, res, next) {
   res.send({
     message: "post alarm"
   });
});

module.exports = router;