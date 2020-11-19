require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

//packages to make a session
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);

//packages for login
const bcrypt= require('bcryptjs');
const passport= require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/User.model');

mongoose
  .connect('mongodb://localhost/auth-with-passport', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

//session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: new MongoStore( { mongooseConnection: mongoose.connection }),
    resave: true,
    saveUninitialized: true
  })
);

//initialize passport and passport session like a middleware: always after the app.use(session...)
app.use(passport.initialize());
app.use(passport.session());

//define serialize() & deserialize() methods
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err))
  ;
});

//define localStrategy method
passport.use(new LocalStrategy(
  {
    usernameField: 'username', // by default
    passwordField: 'password'  // by default
  },
  (username, password, done) => {
    User.findOne({username})
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
 
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password" });
        }
 
        done(null, user);
      })
      .catch(err => done(err))
    ;
  }
));


// Routes middleware goes here
const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

module.exports = app;
