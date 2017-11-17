var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var app = express();






//mongoose configuration
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/passport");


//require the user model
const User          = require("./models/user");
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash         = require("connect-flash");
const layouts       = require('express-ejs-layouts');


// run the code that setup the User database connection'
require("./config/user");

// run the code that setup the Passport
require("./config/passport-setup");

// default value for title local
app.locals.title = 'Authentication';
//enable sessions here

app.use( session ({
  resave: true,
  saveUninitialized: true,
  secret: "this string is to avoid errors"
})
);


//initialize passport and session here

app.use (passport.initialize());
app.use (passport.session());

//defines a costmo middleware to define " currentUser" in all our views
app.use((req, res, next) => {
  // passport defines "req.user" if the user is logged in
  // ("req.user" is the result of deserialize)
  res.locals.currentUser = req.user;

  // call "next()" to tell Wxpress that we've finished
  // (otherwise your browser will hang)
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
app.use(layouts);

// require in the routers-----------------------------------
const index = require('./routes/index');
app.use('/', index);

const users = require('./routes/users');
app.use(users);

const passportRouter = require("./routes/passportRouter");
app.use(passportRouter);

// END Route




//passport code here

app.use((req, res, next) => {
  res.locals.passportUser = req.user;

  next();
});








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
