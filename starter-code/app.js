require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const passport = require('passport');
const User = require('./models/User');

require('./configs/db.config');

const session = require('express-session');
const bcryptjs = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());


app.use(
    session({
      secret: 'our-passport-local-strategy-app',
      resave: true,
      saveUninitialized: true
    })
  );

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});
  
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username })
        .then(user => {
        if (!user) {
          next(null, false, { message: 'Incorrect username' });
        }
        if (!bcryptjs.compareSync(password, user.password)) {
          next(null, false, { message: 'Incorrect password' });
        }
        next(null, user);
      })
      .catch(error => {
        next(error);
      });
  })
);
  
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
app.use('/', passportRouter);


module.exports = app;
