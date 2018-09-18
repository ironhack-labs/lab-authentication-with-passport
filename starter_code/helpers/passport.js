const passport = require('passport')
const User = require('../models/User')

//local strategy
passport.use(User.createStrategy())

//serializer user
passport.serializeUser(function(user,cb){
  cb(null, user)
})

//deserialize user
passport.deserializeUser(function(user,cb){
  cb(null,user)
})

module.exports = passport