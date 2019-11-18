require('dotenv').config();

const User = require("./models/user")

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const flash = require("connect-flash");
const session = require('express-session')
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport')
const app = express();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;



mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// Middleware Setup
app.use(session({ secret: "tuloko", resave: true, saveUninitialized: true }))
app.use(flash())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())


// PASSPORT: Serializado / des-serializado Usuario
passport.serializeUser((user, cb) => cb(null, user._id));
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


// PASSPORT: estrategia
passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
  User.findOne({ username })
    .then(theUser => {
      if (!theUser) return next(null, false, { message: "Nombre de usuario incorrecto" })
      if (!bcrypt.compareSync(password, theUser.password)) return next(null, false, { message: "Contraseña incorrecta" })
      return next(null, theUser);
    })
    .catch(err => next(err))
}))


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
app.locals.title = 'Express - Generated with IronGenerator';


// Routes middleware goes here

app.use('/', require('./routes/index'));
app.use('/', require("./routes/passportRouter"));


module.exports = app;
