require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const passport = require("passport");
const session      = require('express-session'); //SEMPRE PRECISO DAR O REQUIRE PRO SESSION
const MongoStore   = require('connect-mongo')(session);
const LocalStrategy = require("passport-local").Strategy;
// adding user model and bcrypt for passport local strategy 
const User = require('./models/user')
const bcrypt = require("bcrypt");
//error control - flash
const flash = require("connect-flash");


mongoose
  .connect('mongodb://localhost/lab-authentication-with-passport', {useNewUrlParser: true})
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

// app.use(require('node-sass-middleware')({
//   src:  path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   sourceMap: true
// }));
      
app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  resave: true,
  saveUninitialized: true
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//PASSPORT CONFIG
//cookie
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

//session
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

//USE FLASH
app.use(flash());

//PASSPORT LOCAL STRATEGY CONFIG
passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    //success
    return next(null, user);
  });
}));

//PASSPORT INITIALIZE
app.use(passport.initialize());
app.use(passport.session());


// default value for title local
app.locals.title = 'Lab Authetication with Passport';


// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);

const passportRouter = require("./routes/passportRouter");
app.use('/', passportRouter);


module.exports = app;
