const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');


mongoose.connect('mongodb://localhost/passport-app');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express this come from app.js';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.use( session({
  secret: 'my cool passport app',

  // these two options are there to prevent warnings in terminal
  resave: true,
  saveUninitialized: true
}) );

// These need to come AFTER the session middleware
app.use(passport.initialize());
app.use(passport.session());
// ... and BEFORE our routes

// This middleware sets the user variable for all views
// (only if logged in)
//   user: req.user     for all renders!
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }

  next();
});


// PASSPORT GOES THROUGH THIS
  // 1. Our form
  // 2. LocalStrategy callback
  // 3. (if successful) passport.serializeUser()


// Determines WHAT TO SAVE in the session (what to put in the box)
// (called when you log in)
passport.serializeUser((user, cb) => {
  // "cb" is short for "callback"
  cb(null, user._id);
});


const User = require('./models/user-model.js');

// Where to get the rest of the user's information (given what's in the box)
// (called on EVERY request AFTER you log in)
passport.deserializeUser((userId, cb) => {
  // "cb" is short for "callback"

  // query the database with the ID from the box
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }

    // sending the user's info to passport
    cb(null, theUser);
  });
});


const LocalStrategy = require('passport-local').Strategy;
// The same as:
// const passportLocal = require('passport-local');
// const LocalStrategy = passportLocal.Strategy;

const bcrypt = require('bcrypt');


passport.use( new LocalStrategy(
  // 1st arg -> options to customize LocalStrategy
  {// <input name="loginUsername">
    usernameField: 'loginUsername',
    // <input name="loginPassword">
    passwordField: 'loginPassword'
  },

  // 2nd arg -> callback for the logic that validates the login
  (loginUsername, loginPassword, next) => {
    User.findOne(
      { username: loginUsername },
      (err, theUser) => {
      // Tell Passport if there was an error (nothing we can do)
        if (err) {
          next(err);
          return;
        }

        // Tell Passport if there is no user with given username
        if (!theUser) {
            //       false in 2nd arg means "Log in failed!"
            //         |
          next(null, false);
          return;
        }

        // Tell Passport if the passwords don't match
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
            //       false in 2nd arg means "Log in failed!"
            //         |
          next(null, false);
          return;
        }

        // Give Passport the user's details (SUCCESS!)
        next(null, theUser);
          // -> this user goes to passport.serializeUser()
      }
    );
  }
) );




// OUR ROUTES HERE
// ----------------------------------------------------------
const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/passportRouter.js');
app.use('/', myAuthRoutes);

const myUserRoutes = require('./routes/users.js');
app.use('/', myUserRoutes);
// ----------------------------------------------------------



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;