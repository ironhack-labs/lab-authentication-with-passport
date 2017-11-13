const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const index = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const User = require('./models/user');

// -- setup

var app = express();

// mongoose configuration
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passport-local');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable sessions here

app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true
}));

// initialize passport and session here

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ '_id': id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: 'Incorrect username' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: 'Incorrect password' });
    }

    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

// -- routes

app.use('/', index);
app.use('/', users);
app.use('/', auth);

// -- 404 and general error handler

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
