
const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const ensureLogin    = require("connect-ensure-login");
const flash          = require("connect-flash");
const app = express();

const index = require('./routes/index');
const users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");

//express-layout
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('views', __dirname + '/views');

//mongoose configuration
const mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/passport-local", {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

//require the user model
const User          = require("./models/user");
const session       = require("express-session");
const MongoStore    = require('connect-mongo')(session);
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//enable sessions here
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
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
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy({ passReqToCallBack: true },(req, username, password, next) => {
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

// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use(function (req, res, next) {
  res.status(404);
  res.render('not-found');
});

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app;
