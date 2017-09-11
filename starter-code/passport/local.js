const bcrypt = require("bcrypt")
const passport = require("passport")
const User = require("../models/user")
const LocalStrategy = require("passport-local").Strategy
const path = require("path")


passport.use(new LocalStrategy((username, password, next)=>{
  User.findOne({username}, (err, user)=>{
    if (err) {
      return next(err)
    }
    if (!user) {
      return next(null, false, {message: "User not found"})
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message: "Wrong password"})
    }
    return next(null, user)

  })
}))
