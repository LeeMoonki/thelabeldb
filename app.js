var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var labels = require('./routes/labels');
var posts = require('./routes/posts');
var messages = require('./routes/messages');
var likes = require('./routes/likes');
var auth = require('./routes/auth');
var alarms = require('./routes/alarms');


var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);

var app = express();

app.set('env', 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 사진 url 
app.use('/labelProfiles', express.static(path.join(__dirname, 'uploads/images/labelProfiles')));
app.use('/userProfiles', express.static(path.join(__dirname, 'uploads/images/userProfiles')));
app.use('/postFiles', express.static(path.join(__dirname, 'uploads/postFiles')));


app.use(session({
  secret: '4e4adcc0-f2bf-40ac-ba32-cd373cc0981a',
  sore: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    client: redisClient
  }),
  resave: true,
  saveUninitialized: false
}));

// session을 만든 '다음에' passport 설정
// npm -> passport -> middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/labels', labels);
app.use('/posts', posts);
app.use('/messages', messages);
app.use('/likes', likes);
app.use('/auth', auth);
app.use('/alarms', alarms);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
