const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

const app = express();

//ROUTES
const index = require('./routes/index');
const users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");

//mongoose configuration
mongoose.connect("mongodb://localhost/passport-local");

//require the user model
const User = require("./models/user");

//enable sessions here
app.use(session({
  secret: "basic-auth-secret",
  resave: true,
  saveUninitialized: true
}));

//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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
passport.serializeUser((user, cb) => {
  console.log('passport serializer',user);
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  console.log('passport deserializer',id);
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
  }, (req,username, password, next) => {
  console.log('passport localstrategy');
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
