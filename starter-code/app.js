require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require('express-session')
const bcrypt = require('bcrypt');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy
const flash = require('connect-flash');

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
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
  secret: 'garys tales',
  resave: false,
  saveUninitialized: false
}))

// Set up Passport

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  User.findOne({ _id })
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

passport.use(
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password' //incase we are not passing username and password we change the string to the expected field
  },(username, password, done) => {
    User.findOne({ username })
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          done(null, false, { message: 'Wrong credentials' });
        }
        // Success
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  })
);

passport.use(new GitHubStrategy({
    clientID: 'b25aeb7b3e98b5bbab45',
    clientSecret: 'a7b9c9f277453f6881e8fac099be73051ff83ab4',
    callbackURL: "http://127.0.0.1:3000/passport/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    console.log(profile)
    User.findOne({githubId: profile.id})
    .then(user => {
      if (user) return done(null, user)
        User.create({githubId: profile.id, login: profile.login}).then(newUser => {
          done(null, newUser)
        })
      
    }).catch(err => {
      done(err)
    })
  }
));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



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
app.locals.title = 'Express - Generated with IronGenerator';


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/passport', passportRouter);


module.exports = app;
