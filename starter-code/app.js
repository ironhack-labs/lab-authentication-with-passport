var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);
var app = express();
app.use(flash());

require('./configs/db.config'); 
require('./configs/passport.config').setup(passport); 

var index = require('./routes/index');
var users = require('./routes/users');
var passportRouter = require('./routes/passportRouter');


app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//mongoose configuration


//require the user model

//enable sessions here

//initialize passport and session here

// view engine setup

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'Super Secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  })
}));

app.use(passport.initialize());
app.use(passport.session());
// require in the routers
app.use('/passport', passportRouter);
app.use('/', index);
app.use('/', users);






//passport code here








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
