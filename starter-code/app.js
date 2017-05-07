const express         = require('express');
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const cookieParser    =  require('cookie-parser');
const bodyParser      = require('body-parser');
const layouts         = require('express-ejs-layouts');
const session         = require("express-session");
const bcrypt          = require("bcrypt");
const passport        = require("passport");
const LocalStrategy   = require("passport-local").Strategy;
const flash           = require("connect-flash");

//mongoose configuration
const mongoose       = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");

//require the user model
const User            = require("./models/user");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.title = 'Express - Authentication/ Passport-App';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

//enable sessions here
app.use( session({
  secret: '1st Auth/Passport-App',
  resave: true,
  saveUninitialized: true

}) );

//initialize passport and session here
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
});

////------------------------ Routes-------------------------------//////
const index = require('./routes/index');
app.use('/', index);

const users = require('./routes/users');
app.use('/', users);

const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);
////-----------------------------------------------------------//////////

//passport code here

passport.serializeUser((user, cb) =>{
  cb(null, user._id);
});

passport.deserializeUser((userId, cb) => {
  User.findById(userId, (err, theUser) => {
    if (err){
      cb(err);
      return;
    }
    cb(null, theUser);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },

  (loginUsername, loginPassword, next) => {
    User.findOne(
      {username: loginUsername},

      (err, theUser)=> {
        if (err){
          next(err);
          return;
        }
        if (!theUser){
          next(null, false);
          return;
        }
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          next(null,false);
          return;
        }
        next(null, theUser);
      }
    );
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
