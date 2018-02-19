var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");

//importacion de rutas
var index = require('./routes/index');
var users = require('./routes/users');
const authRouter = require("./routes/auth-routes");

var app = express();
//connect to database
mongoose.connect("mongodb://localhost:27017/pass");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//model
const User = require("./models/User");

//Flash for errors
const flash = require("connect-flash");

// ···········passport··············
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//session middleware
app.use(session({
  secret: "bliss",
  resave: true,
  saveUninitializer: true
}));
//passport session
//before
passport.serializeUser((user,cb)=>{
cb(null, user._id);
});

passport.deserializeUser((id, cb)=>{
User.findOne({"_id":id}, (err,user)=>{
  if(err) return cb(err);
  cb(null, user);
})
});

app.use(flash());

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
  if(err) return next(err);
  if(!user) return next(null, false, {message: "incorrect username"});
  if(!bcrypt.compareSync(password, user.password)) return next(null, false, {message: "Incorrecto password"});
  return next(null, user);
});
}));

//after
app.use(passport.initialize());
app.use(passport.session());

//********************************** passport ****************

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
