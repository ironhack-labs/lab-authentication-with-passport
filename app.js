require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');


const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { Passport } = require('passport');

const User = require('./models/User.model')

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



//PASO 3 Configurar el middleware de Session --------------
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

//PASO 4 Configurar la serialización del usuario --------------------
passport.serializeUser((user, callback)=> {
  callback(null, user._id)
})

//PASO 5 Configurar la deserialización del usuario --------------------
passport.deserializeUser((id, callback)=>{
  User.findById(id)
  .then((result)=>{
    callback(null, result)
  })
  .catch((err)=>{
    callback(err)
  })
})

//PASO 6 Configurar el middleware de flash --------------------
app.use(flash())

//paso 7 Configurar el middleware del Strategy -------------------- Esto es lo que verifica si el usuario y la contraseña son correctos
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, next)=> {
  User.findOne({username})
  .then((user) => {
    if(!user){ //Si el usuario no coincide
      return next(null, false, {message: 'Incorrect username'})
    }
    
    if(!bcrypt.compareSync(password, user.password)){ //Si la contraseña no coincide
      return next(null, false, {message: 'Incorrect password'})
    }
    
    return next(null, user)
  })
  .catch((err) => {
    next(err)
  });
}))

//PASO 10 Configurar el moddleware de passport -------------
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
