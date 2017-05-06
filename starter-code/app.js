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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.title = 'Express - Generated with IronGenerator';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use( session({
  secret: 'my cool passport app',

  resave: true,
  saveUninitialized: true
}) );

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }

  next();
});

  var User  = require("./models/user.js");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

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

passport.use( new LocalStrategy(
  {    usernameField: 'loginUsername',
       passwordField: 'loginPassword'
  },

  (loginUsername, loginPassword, next) => {
    User.findOne(
      { username: loginUsername },

      (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!theUser) {
          next(null, false);
          return;
        }
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          next(null, false);
          return;
        }
        next(null, theUser);
      }
    );
  }
) );




//  ROUTES
const index = require('./routes/index');
app.use('/', index);

const myPassRoutes = require('./routes/passportRouter.js');
app.use('/', myPassRoutes);

const myUserRoutes = require('./routes/user.js');
app.use('/', myUserRoutes);

// END ROUTES----------------------------------------------------------



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
