const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
module.exports = app => {

  app.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  }))
  const User = require('../models/user.model')

  passport.serializeUser((user, next) => next(null, user._id))

  passport.deserializeUser((id, next) => {

    User.findById(id, (err, user) => {
      if (err) {
        return next(err)
      }
      next(null, user)
    })
  })


  app.use(flash())

  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, next) => {

    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return next(null, false, {
          message: "El usuario es incorrecto, prueba de nuevo merluzo"
        })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: "La contraseña es incorrecta, no te creas hackerman..."
        })
      }

      return next(null, user)
    })
  }))

  app.use(passport.initialize())
  app.use(passport.session())

}