var express = require('express');
var router = express.Router();

var Like = require('../models/like');

/* GET users listing. */
router.get('/', function(req, res, next) {

    var page = parseInt(req.query.page) || 1;
    var count = parseInt(req.query.count) || 10;

    res.send({
        message: "I like!!!",
        page: page,
        count: count
    });
});

module.exports = router;