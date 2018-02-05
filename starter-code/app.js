const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

const index = require('./routes/index');
const users = require('./routes/users');
const passportRouter = require("./routes/passportRouter");
//mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-local");
const session       = require("express-session");
const MongoStore = require("connect-mongo")(session); 
const passportConfig = require('./passport-strate')

//require the user model
const User = require("./models/user");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");



mongoose.connect("mongodb://localhost/passport-auth")

//enable sessions here




//initialize passport and session here





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
passportConfig(app);

app.use((req,res,next) => {
  res.locals.user = req.user;
  res.locals.title = 'authentication-with-passport';
  next();
}) 
app.use(express.static(path.join(__dirname, 'public')));
// require in the routers
app.use('/', index);
app.use('/user', users);
app.use('/auth', passportRouter);





//passport code here










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
