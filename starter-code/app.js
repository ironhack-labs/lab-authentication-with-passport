var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const layouts  = require('express-ejs-layouts');
var app = express();

var index = require('./routes/index');
var users = require('./routes/users');

const passportRouter = require("./routes/passportRouter");
//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");
//require the user model
const User = require("./models/user");
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");





//enable sessions here
app.use(session(
  {
    secret: 'this string needs to be different for every app',
    resave: true,
    saveUninitialized: true
  }
));



//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(layouts);

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
passport.serializeUser((userFromDb, done)=>{
  done(null, userFromDb._id);

});

passport.deserializeUser((id, done)=>{
  User.findById(
    id,
    (err, userFromDb)=>{
      if(err){
        done(err);
        return;
      }
      done(null, userFromDb);
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, done)=>{

      User.findOne(
        {username: username},
        (err, userFromDb)=>{
          if(err){
            done(err);
            return;
          }
          if(userFromDb === null){
            done(null, false, {message: "Username or password is incorrect."});
            return;
          }
          const goodPassword = bcrypt.compareSync(password, userFromDb.password);
          if(goodPassword === false){
            done(null, false, {message: "Username or password is incorrect."});
            return;
          }
          done(null, userFromDb);
        });
    }
  )
);






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
