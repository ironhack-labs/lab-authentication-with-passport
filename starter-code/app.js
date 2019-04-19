require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/User')
const flash = require("connect-flash");

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

// --- Configuration part for login ---
// Triggered when the log in is successfull (you will never have to change it)
passport.serializeUser((user, cb) => {
  console.log('CALL OF serializeUser', user)
  cb(null, user._id);
});

// Triggered when a connected user is doing a request (you will never have to change it)
passport.deserializeUser((id, cb) => {
  console.log('CALL OF deserializeUser', id)
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// A strategy is used when the user tries to log in
app.use(flash()); // Allows flash errors
passport.use(new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  console.log('CALL OF LocalStrategy', username, password)
  User.findOne({ username })
    .then(userFromDb => {
      if (!userFromDb) {
        // The login failed and we send `req.flash("error")` to the next page that is `{ message: "Incorrect username" }`
        done(null, false, { message: "Incorrect username" })
      }
      else if (!bcrypt.compareSync(password, userFromDb.password)) {
        done(null, false, { message: "Incorrect password" })
      }
      else {
        // Log in `userFromDb` 
        done(null, userFromDb)
      }
    })
    .catch(err => done(err))
}));


app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

app.use((req,res,next) => {
  res.locals.connectedUser = req.user
  next()
})

// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);
const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);


module.exports = app;
