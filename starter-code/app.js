require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('./models/User.model');

mongoose
  .connect('mongodb://localhost/lab-authentication-with-passport', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(
  `${app_name}:${path.basename(__filename).split('.')[0]}`
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: 'passport-local-strategy-app',
    resave: true,
    saveUninitialized: true,
  })
);

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user);
    })
    .catch(error => {
      next(error);
    });
});

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return next(null, false, { message: 'Incorrect username' });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: 'Incorrect password' });
          }
          next(null, user);
        })
        .catch(error => {
          next(error);
        });
    }
  )
);

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require('./routes/passport.router');
app.use('/', passportRouter);

module.exports = app;
