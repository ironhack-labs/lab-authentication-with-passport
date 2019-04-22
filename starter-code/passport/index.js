const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const User = require('../models/User')
const bcrypt = require('bcrypt')

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(err) return done(err)
    done(null, user)
  })

  /*const user = User.findById(id)
  try {
    done(null, user)
  } catch(err) {
    return done(err)
  }*/
})

passport.use(new LocalStrategy(
  async (username, password, next) => {
    try{
      const user = await User.findOne({ username })

      if(!user) return next(null, false, {err: 'Incorrect username'})

      if(!bcrypt.compareSync(password, user.password)) return next(null, false, {err: 'Incorrect password'})

      return next(null, user)

    } catch(err) {
      return next(error)
    }    
  })
)

module.exports = passport