var express = require('express');
var router = express.Router();

var Message = require('../models/message');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('message');
});

router.get('/', function(req, res, next) {
    res.send('message');
});

router.post('/', function(req, res, next) {
    res.send('message');
});

module.exports = router;