const bcrypt = require("bcrypt")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User.model")

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
      const user = await User.findOne({ username })
      if (!user) {
        return done(null, false, { message: "Incorrect username" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" })
      }

      done(null, user) // envia el usuario a serializeUser
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id)
  user.password = null
  cb(null, user) // Guarda lo que le enviamos como segundo argumento en la sesion como req.user
})

module.exports = passport