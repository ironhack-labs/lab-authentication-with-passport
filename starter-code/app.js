var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var index = require('./routes/index');
var users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");
//mongoose configuration

const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/passport-local");
//require the user model
const User = require("./models/user");
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");





//enable sessions here
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'this string is to avoid errors'
}));


//initialize passport and session here
passport.serializeUser((userFromDb, cb) => {
  cb(null, userFromDb._id);
});

passport.deserializeUser((idFromSession, cb) => {
  UserModel.findById(idFromSession).then(userFromDb => {
    cb(null, userFromDb);
  }).catch(error => {
    cb(error);
  });
});
//strategies




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// require in the routers
app.use('/', index);
app.use('/', users);
app.use('/', passportRouter);




//passport code here


app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
