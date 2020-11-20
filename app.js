require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session       = require('express-session');
const bcrypt        = require('bcryptjs')
const flash         = require('connect-flash')

mongoose
  .connect(`mongodb://localhost/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

const User = require('./models/User.model');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware de Session
app.use(session({secret: `${process.env.SECRET}`, resave: true, saveUninitialized: true}))

//Middleware para serializar al usuario
passport.serializeUser((user, callback)=>{
  callback(null, user._id)
})

//Middleware para des-serializar al usuario
passport.deserializeUser((id, callback)=>{
  User.findById(id)
    .then((user) => callback(null, user))
    .catch((err) => callback(err))
})

//Middleware de flash
app.use(flash())

//Middleware del Strategy
passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next)=>{
  User.findOne({username})
    .then((user)=>{

      if(!user){
        return next(null, false, {message: "Incorrect username"})
      }

      if(!bcrypt.compareSync(password, user.password)){
        return next(null, false, {message: "Incorrect password"})
      }

      return next(null, user)
    })
    .catch((err) => next(err))
}))

//Middleware de passport
app.use(passport.initialize())
app.use(passport.session())

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes middleware goes here
const index = require('./routes/index.routes');
app.use('/', index);
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

module.exports = app;
