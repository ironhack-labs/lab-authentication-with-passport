const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({username})
      .then(user => {
          if (!user) throw new Error("Incorrect Username")
          if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect Password")
          console.log(user)
          return next(null, user)
      })
      .catch(err => {
          next(null, false, {
              errorMessage: err.message
          })
      })
}))