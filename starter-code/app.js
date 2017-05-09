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
  secret: 'my cool homework app',
  //these two options are there to prevent warnings
  resave: true,
  saveUninitialized: true
}));




//initialize passport and session here

app.use(passport.initialize());
app.use(passport.session());



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

//This is middlewear sets the user variable for all views
//(only if logged in)
// user:req.user for all renders
app.use((req, res, next) => {
  if(req.user) {
    res.locals.user = req.user;
  }
  next();
});

// Determines what to save in the session (what to put in the box)
passport.serializeUser((user, cb) => {
  //"cb" is short for callback
  cb(null, user._id);
});


// Where to get the rest of the user's information (given whats in the box)
passport.deserializeUser((userId, cb) => {
  //"cb" is short for callback
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }
    //sending the user's info to passport
    cb(null, theUser);
  });
});

passport.use(new LocalStrategy(
  //1st arg -> options to customize LocalStrategy
  {
    //
    // Examples: <input name = "loginEail">
    usernameField: 'loginUsername',
    // <input name = "loginPassword">
    passwordField: 'loginPassword'
  },

  //2nd arg -> callback for the logic that validates login
  (loginUsername, loginPassword, next) => {
    User.findOne(
      { username: loginUsername },

      (err, theUser) => {
        //Tell passport if there was an error (nothing we can do)
        if(err) {
          next(err);
          return;
        }

        //Tell passport if there is no user with given username
        if(!theUser) {
          //          false in 2nd arg means "Log in Failed"
          //             |
          next(null, false);
          return;
        }

        // Tell passport if the passwords don't match
        if (!bcrypt.compareSync(loginPassword, theUser.password)) {
            //          false in 2nd arg means "Login failed"
            next(null, false);
            return;
        }

        //Give passport the user's details (SUCCESS)
        next(null, theUser);
        // -> this user goes to passport.serializeUser()

    });
  }
) );









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
