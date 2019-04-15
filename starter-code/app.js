require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash")
const User = require("./models/user")
const bcrypt = require("bcrypt");

mongoose
  .connect('mongodb://localhost/natibeto', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User
    .findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
});

passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, next) => {
  User
    .findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
      return next(null, user); //El next, nos da acceso a private page (ya estamos logeados)
    });
}));

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));




// default value for title local
app.locals.title = 'NatiBeto WebPage';


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);


module.exports = app;
