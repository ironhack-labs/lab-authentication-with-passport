const passport        = require("passport")
const User            = require("../models/User")

//LOCAL STRATEGY
passport.use(User.createStrategy())

//SERIALIZE USER
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

//DESERIALIZE USER
passport.deserializeUser(function(user,cb){
  cb(null,user)
})

module.exports = passport