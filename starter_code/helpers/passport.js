const passport = require('passport')
const User = require('../models/User')

passport.use(User.createStrategy())

passport.serializeUser(function(user,cb){
  cb(null,user)
})

passport.deserializeUser(function(user,cb){
  cb(null,user)
})

module.exports = passport