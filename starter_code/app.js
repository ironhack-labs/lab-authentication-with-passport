require('dotenv').config();

const session       = require("express-session");
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash         = require("connect-flash");
// const FbStrategy    = require('passport-facebook').Strategy;

const User = require("./models/user");

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/passport-authentication', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
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

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Passport Authentication';


// session
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


// passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  console.log("CALL OF passport.serializeUser")
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  console.log("CALL OF passport.deserializeUser")
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());
passport.use(new LocalStrategy((username, password, next) => {
  console.log("CALL OF passport.use of LocalStrategy")
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username or password" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect username or password" });
    }

    return next(null, user);
  });
}));


const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/passportRouter');
app.use('/', authRoutes);



module.exports = app;
