'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');

const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');


const passport = require('passport');
const PassportLocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const passportRouter = require("./routes/passport");

const app = express();

// Setup view engine
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(express.static(join(__dirname, 'public')));
app.use(sassMiddleware({
  src: join(__dirname, 'public'),
  dest: join(__dirname, 'public'),
  outputStyle: process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
  sourceMap: true
}));

app.use('/', indexRouter);
app.use('/', passportRouter);





app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 60 * 60 * 24 * 1000 },
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

//Passport Configuration

const User = require('./models/user');

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      if (!user) {
        callback(new Error('MISSING_USER'));
      } else {
        callback(null, user);
      }
    })
    .catch(error => {
      callback(error);
    });
});

passport.use('login', new PassportLocalStrategy((username, password, callback) => {
  User.signIn(username, password)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
}));

passport.use('signup', new PassportLocalStrategy((username, password, callback) => {
  User.signUp(username, password)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || 500);
  res.render('error');
});

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
