require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const User = require('./models/User.model');
const bcrypt = require('bcrypt');

////////////////// - EXPRESS SESSION - //////////////////
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo(expressSession);
/////////////////////////////////////////////////////////

////////////////// - PASSPORT - /////////////////////////
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
/////////////////////////////////////////////////////////

mongoose
  .connect('mongodb://localhost/auth-with-passport', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('../lab-authentication-with-passport/package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

////////////////// - EXPRESS SESSION - //////////////////
const session = expressSession({
  secret: process.env.SESSION_SECRET || 'super secret (should be changed)',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: process.env.SESSION_MAX_AGE || 3600000,
  })
});
/////////////////////////////////////////////////////////

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

////////////////// - PASSPORT - /////////////////////////
app.use(passport.initialize());

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
})

/* USER + PASSWORD LOGIN */
passport.use(new LocalStrategy (
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  (username, password, done) => {
    User.findOne({username})
      .then(user => {
        if (!user) {
          return done(null, fale, {message: 'Incorrect username or password.'})
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done (null, false, { message: 'Incorrect username or password.'})
        }
        done(null, user);
      })
      .catch(err => done(err));
  }
))

/* GOOGLE LOGIN */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google account details: ', profile);

      User.findOne({googleID: profile.id})
        .then(user => {
          if(user) {
            done(null, user);
            return;
          }

          User.create({googleID: profile.id})
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err));
        })
        .catch(err => done(err));
    }
  )
)

app.use(passport.session());
/////////////////////////////////////////////////////////

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes middleware goes here
const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
