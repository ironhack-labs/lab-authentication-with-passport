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
const flash        = require('connect-flash');

mongoose.connect('mongodb://localhost/passport-local');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'THE WALRUS CONNECTION';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use( session({
  secret: 'my cool passport app duks',
  resave: true,
  saveUninitialized: true
}) );
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }

  next();
});

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

const User = require('./models/user-model.js');

passport.deserializeUser((userId, cb) => {
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, theUser);
  });
});

const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

passport.use( new LocalStrategy (
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'

  },

  (loginUsername, loginPassword, next) => {
      User.findOne({ username: loginUsername }, (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!theUser) {
          next(null, false, { message: 'Wrong username, buddy'});
          return;
        }

        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          next(null, false, {message: 'Wrong passport, friend!'});
          return;
        }

        next(null, theUser, {
          message: `Login for ${theUser.username} succesful.`
        });
      });
  }
));


const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes.js');
app.use('/', myAuthRoutes);

const myUserRoutes = require('./routes/user-routes.js');
app.use('/', myUserRoutes);

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
