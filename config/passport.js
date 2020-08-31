const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { compareSync } = require("bcrypt")
const User = require("../models/User.model")

passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password" 
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ username: email })
          if (!user) return done(null, false, { message: "incorrect username" })
          if (!compareSync(password, user.password))
            return done(null, false, { message: "Incorrect password" })
          done(null, user)
        } catch (error) {
          console.error(error)
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
          done(null, user._id)
  })
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id, {'password': 0})
      //console.log(`mi usuario en deserialize ${user}`)
      done(null, user )
    } catch (error) {
      done(error)
    }
  })
  
  module.exports = passport