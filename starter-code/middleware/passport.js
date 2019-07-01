const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
const { compareSync } = require('bcrypt')

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id)
    cb(null, user)
  } catch (err) {
    cb(err)
  }
})

passport.use(
  new localStrategy(async (username, password, next) => {
    try {
      const user = await User.findOne({ username })
      if (!user) {
        return next(null, false, { message: 'Incorrect Username' })
      }
      if (!compareSync(password, user.password)) {
        return next(null, false, { message: 'Incorrect Passport' })
      }
      next(null, user) //se envia al serialize user
    } catch (error) {
      next(error)
    }
  })
)

module.exports = passport
