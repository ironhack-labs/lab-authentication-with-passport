require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const User = require('./models/user');

const session = require('express-session');
const passport = require('passport');

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/passport-local', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!');
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Express View engine setup

app.use(
  require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    sourceMap: true,
  })
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(
  session({
    secret: 'secret different for every app',
    saveUninitialized: true,
    resave: true,
  })
);

// PASSPORT LOCAL STRATEGY

passport.serializeUser((userDetails, done) => {
  console.log('serialize (save to session)');
  done(null, userDetails._id);
});

passport.deserializeUser((idFromSession, done) => {
  console.log('deserialize (details from session)');
  User.findById(idFromSession)
    .then(userDetails => {
      done(null, userDetails);
    })
    .catch(err => {
      done(err);
    });
});

function passportSetup(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.oneUser = req.user;
    next();
  });
}

passportSetup(app);

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

const index = require('./routes/index');
const passportRouter = require('./routes/passportRouter');
app.use('/', index);
app.use('/', passportRouter);

module.exports = passportSetup;
module.exports = app;
