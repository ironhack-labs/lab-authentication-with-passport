const express = require('express')
const path = require('path')
// onst favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')
const mongoose = require('mongoose')
var expressLayouts = require('express-ejs-layouts')

// Routes to be required
const index = require('./routes/index')
const users = require('./routes/users')
const passportRouter = require('./routes/passportRouter')

// mongoose configuration
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/passport-pp', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
})

// require the user model
const User = require('./models/user')

// enable sessions here
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    }),
    secret: 'foobar',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)

// initialize passport and session here

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return cb(err)
    }
    cb(null, user)
  })
})

app.use(flash())
passport.use(
  new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return next(null, false, { message: 'Incorrect username' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: 'Incorrect password' })
      }

      return next(null, user)
    })
  })
)

app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// require in the routers
app.use('/', index)
app.use('/', users)
app.use('/', passportRouter)

// passport code here

// -- 404 and error handler

// NOTE: requires a views/not-found.ejs template
app.use(function (req, res, next) {
  res.status(404)
  res.render('not-found')
})

// NOTE: requires a views/error.ejs template
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err)

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500)
    res.render('error')
  }
})

module.exports = app
