var express = require('express');
var path = require('path');
var url = require('url');

var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var isSecure = require('./common').isSecure;
var hostAddress = require('../models/common').hostAddress;


passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, function(email, password, done) {
    User.findByEmail(email, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        User.verifyPassword(password, user.password, function(err, result) {
            if (err) {
                return done(err);
            }
            if (!result) {
                return done(null, false);
            }
            delete user.password;
            done(null, user);
        })
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findUser(id, function(err, user) {
      if (err) {
        return done(err);
      } else {
        done(null, user);
      }
    });
});

router.post('/local/login', isSecure, function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({
                message: 'Login failed!!!'
            });
        }
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            next();
        });
    })(req, res, next);
}, function(req, res, next) {
    var user = {};
    var filename = path.basename(req.user.imagepath);
    user.email = req.user.email;
    user.nickname = req.user.nickname;
    user.imagepath = url.resolve(hostAddress, '/userProfiles/' + filename);
    user.position_id = req.user.position_id;
    user.genre_id = req.user.genre_id;
    user.city_id = req.user.city_id;
    user.town_id = req.user.town_id;
    res.send({
        message: '로그인이 정상적으로 처리되었습니다',
        user: user
    });
});

router.get('/local/logout', function(req, res, next) {
    req.logout();
    res.send({ message: '로그아웃이 정상적으로 처리되었습니다' });
});


module.exports = router;