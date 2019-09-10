// Require user model
const passport = require("passport")
const User = require("../models/User")

// Add passport

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport
