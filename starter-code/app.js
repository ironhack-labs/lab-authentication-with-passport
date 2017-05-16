const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const layouts       = require('express-ejs-layouts');
const mongoose      = require('mongoose');
const session       = require('express-session');
const passport      = require('passport');
const flash         = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogin   = require("connect-ensure-login");

//**********************************************************
// require the code contained in passport-config
//**********************************************************
require('./config/passport-config.js');

// moongose db && express app
mongoose.connect('mongodb://localhost/db_my-passport');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

//*******************************************************
// session middleware here ......
//*******************************************************

app.use( session({
  secret            :  'my passport app',
  resave            :  true,
  saveUninitialized :  true
}) );

//*******************************************************
// flash message middleware here ......
//*******************************************************
app.use(flash());

//*******************************************************
// passport initialize here ......
//*******************************************************
app.use(passport.initialize());
app.use(passport.session());

//*******************************************************
// custom middleware here ......
//*******************************************************
// make the user info available globally
app.use((req, res, next) => {
  if(req.user){
    res.locals.user = req.user;
  }
  next();
});

//*******************************************************
// routes here ......
//*******************************************************

const index = require('./routes/index');
app.use('/', index);

const myAuthRoutes = require('./routes/auth-routes');
app.use('/', myAuthRoutes);

const myUserRoutes = require('./routes/user-routes');
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
