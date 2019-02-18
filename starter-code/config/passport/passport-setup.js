const passport      = require('passport');
const flash         = require("connect-flash");
const User          = require('../../models/user')

//require the local-strategy 
require('./local-strategy')

passport.serializeUser((user, cb) => {
  // null === no errors, all good
  cb(null, user._id); // <== save user ID into session
})
 
 // deserializeUser => retrieve user's data from the database
 // this function gets called everytime we request for a user (every time when we need req.user)
passport.deserializeUser((userId, cb) => {
  User.findById(userId)
  .then(user => {
    cb(null, user);
  })
  .catch( err => cb(err));
})


function passportBasicSetup(app){//<=== This app comes from app.js
  //passport super power is here:
  app.use(passport.initialize()) //===>"fires"
  app.use(passport.session()); //===> connect passport to the session

  
  //to activate flash messages
  app.use(flash())

  app.use((req, res, next) =>{
    res.locals.messages = req.flash(); 
    if(req.user){
      res.locals.currentUser = req.user;//===> Make currentUser available in all HBS whenever we have user in the session
    }
    next();
  })

}

module.exports = passportBasicSetup;