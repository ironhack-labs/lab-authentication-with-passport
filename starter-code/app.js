var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash"); 


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//connect to database
mongoose.connect("mongodb://localhost:27017/pass");

//importacion de rutas
const authRouter = require("./routes/passportRouter.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//uso de rutas
app.use('/', index);
app.use('/users', users);
app.use("/", authRouter);


passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findOne({ "_id": id }, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  app.use(flash());
  
  passport.use(new LocalStrategy({
    passReqToCallback: true
  },(req, username, password, next) => {
  
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));
  
  
  
  
  //initialize passport and session here
  
  app.use(passport.initialize());
  app.use(passport.session());
  

module.exports = app;