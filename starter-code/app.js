const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const debug = require('debug')('app:' + path.basename(__filename).split('.')[0])
const expressLayout = require('express-ejs-layouts')
const mongoose = require("mongoose")
const session = require("express-session")
const bcrypt = require("bcrypt")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const flash = require("connect-flash")
const MongoStore = require('connect-mongo')(session)

const app = express()

// Routes
const index = require('./routes/index')
const passportRouter = require("./routes/passportRouter")


//mongoose configuration
mongoose.connect("mongodb://localhost/passport-local")
  .then(() => debug('Connected to DB'))


//require the user model
const User = require("./models/user")


//enable sessions here

app.use(session({
  secret: "passport-local-session",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}))


//initialize passport and session here
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', 'layout')
app.use(expressLayout)



app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.title = "Auth with Passport"
  next()
})

// require in the routers
app.use('/', index)
app.use('/', passportRouter)

//passport code here

require('./passport/serializers')
require('./passport/local')


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app