var express = require('express');
var router = express.Router();

var isSecure = require('./common').isSecure;

var Label = require('../models/label');

/* GET users listing. */
router.get('/', isSecure, function(req, res, next) {
    res.send('label');
});

module.exports = router;