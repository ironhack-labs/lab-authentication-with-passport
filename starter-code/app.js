const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const layouts        = require('express-ejs-layouts');
const mongoose       = require("mongoose");
const session        = require("express-session");
const passport       = require("passport");
const bcrypt         = require("bcrypt");

const flash          = require("connect-flash");
const LocalStrategy  = require("passport-local").Strategy;

mongoose.connect("mongodb://localhost/passport-local");

const app = express();

const User = require("./models/user");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.use( session( {
  secret: 'this is my passport lab homework on 05/06/17',

  // options to prevent warnings in the terminal
  resave: true,
  saveUninitialized: true
}));

// After session middleware and before routes!
app.use(passport.initialize());
app.use(passport.session());

app.use( (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }

  next();
});

// what to save in the session
passport.serializeUser( (user, cb) => {
  cb(null, user._id);
});

// how to get rest of the info
passport.deserializeUser( (userId, cb) => {

  // find the user by their _id
  User.findById(userId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    // give passport the user
    cb(null, theUser);
  });
});


passport.use(new LocalStrategy(
  {
    usernameField: 'usernameInput',
    passwordField: 'passwordInput'
  },

  (username, password, next) => {

    User.findOne(
      {username: username},
      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!theUser) {
          next(null, false);
          return;
        }

        if (!bcrypt.compareSync(password, theUser.password)) {
          next(null, false);
          return;
        }

        next(null, theUser);
      }
    );
  }
));


// BEGIN ROUTES
// -------------------------------------
const index = require('./routes/index');
app.use('/', index);

const users = require('./routes/users');
app.use('/', users);

const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);
// -------------------------------------
// END ROUTES





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
