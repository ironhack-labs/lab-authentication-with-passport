const express          = require('express');
const path             = require('path');
const favicon          = require('serve-favicon');
const logger           = require('morgan');
const cookieParser     = require('cookie-parser');
const bodyParser       = require('body-parser');
const app              = express();


//MONGOOSE CONFIGURATION
const mongoose         = require("mongoose");

mongoose.connect("mongodb://localhost/passport-local");

// USER MODEL CONFIGURATION
const User             = require("./models/user");
const session          = require("express-session");
const bcrypt           = require("bcrypt");
const passport         = require("passport");
const LocalStrategy    = require("passport-local").Strategy;
const flash            = require("connect-flash");


// SESSION CONFIGURATION
app.use(session({
  secret: 'threatZERO authentication',
  resave: true,
  saveUninitialized: true
  })
);


// PASSPORT INILIZATION AND SESSION CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const index            = require('./routes/index');
const users            = require('./routes/users');
const passportRouter   = require("./routes/passportRouter");

// // require in the routers
app.use('/', index);
app.use('/', users);
app.use('/', passportRouter);





// PASSPORT CONFIGURATION
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


passport.use( new LocalStrategy(
  {
    usernameField: 'loginUsername',
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
));



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
