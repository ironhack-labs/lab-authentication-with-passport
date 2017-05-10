var express          = require('express');
var path             = require('path');
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var app              = express();

//mongoose configuration
const mongoose       = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");
//require the user model
const User           = require("./models/user.js");
const session        = require("express-session");
const bcrypt         = require("bcrypt");
const passport       = require("passport");
const LocalStrategy  = require("passport-local").Strategy;
const layouts        = require('express-ejs-layouts');
const flash          = require('connect-flash');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.title = 'Express - Generated with ArtGenerator(pre-alpha)';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  key: "ArtKey",
  secret: 'ArtSecret',
  cookie:
  {
    maxAge: 100000,
    // path: '/'
  },
  // these two options are there to prevent warnings
  resave: true,
  saveUninitialized: true
}) );
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((userId, cb) => {
  // Query the database with the ID from the box
  User.findById(userId, (err, theUser) =>{
    if (err) {
      cb(err);
      return;
    }
    // sending the user's info to passport
    cb(null, theUser);
  });
});

passport.use(new LocalStrategy(
  {
    // <input name="loginUsername">
    usernameField: 'loginUsername',
    // <input name="loginPassword">
    passwordField: 'loginPassword'
  },

  // 2nd arg -> callback for the logic that validates the login
  (loginUsername, loginPassword, next) =>{
    User.findOne(
      { username: loginUsername},
        (err, theUser) => {
          //  Tell passport if there was an error(nothing we can do)
          if (err) {
           next(err);
           return;
          }
          // Tell passport if there is no user with given username
          if(!theUser) {
          //          false in 2nd arg means "Log in failed!"
          //            |
           next(null, false, { message: 'Wrong username'});
           return;
          }
          // Tell passport if the passwords don't match
          if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
            // false means "Log in failed!"
            next(null, false, { message: 'Wrong password'});
            return;
          }
          // Give passport the user's details
          next(null, theUser, { message: `Login for ${theUser.username} successful`});
          //  -> this user goes to passport.serializeUser()
        }
    );
  }
) );
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});
// require in the routers
// --------------------------------
const index = require ('./routes/index');
app.use('/', index);

const users = require('./routes/users.js');
app.use('/', users);

const passportRouter = require("./routes/passportRouter.js");
app.use('/', passportRouter);
// ----------------------------------
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
