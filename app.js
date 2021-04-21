require('dotenv').config();

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express');
const favicon = require('serve-favicon')
const hbs = require('hbs')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')

const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/User.model')

mongoose
  .connect('mongodb://localhost/auth-with-passport', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err))

const app = express()

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))

passport.serializeUser((user, callback)=>{
  callback(null, user._id)
})

passport.deserializeUser((id, callback)=>{

  User.findById(id)
    .then(result => {
      callback(null, result)
    })
    .catch(error => {
      callback(error)
    })
    
})

app.use(flash())

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, next)=>{

  User.findOne({username})
    .then(user => {
      if(!user){
        return next(null, false, {message: 'Incorrect username'})
      }else if(!bcrypt.compareSync(password, user.password)){
        return next(null, false, {message: 'Incorrect password'})
      }else{
        return next(null, user)
      }
    })
    .catch(error => {
      next(error)
    })
}))

app.use(passport.initialize())
app.use(passport.session())


// Express View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))



// Routes middleware goes here
app.use('/', require('./routes/index.routes'))
app.use('/', require('./routes/auth.routes'))


app.listen(process.env.PORT, ()=>{
  console.log(`Conected to the server in ${process.env.PORT}`)
})
