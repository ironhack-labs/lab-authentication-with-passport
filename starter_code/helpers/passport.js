const passport = require('passport')
const User = require('../models/User')

//local strategy
passport.use(User.createStrategy())

//Serialize user 
passport.serializeUser(function(user,cb){
  cb(null,user)
})

//Deserialize user
passport.deserializeUser(function(user,cb){
  cb(null,user)
}) 

module.exports = passport