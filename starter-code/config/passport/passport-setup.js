const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('../../models/user');
const flash        = require('connect-flash')

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

passport.use(new LocalStrategy({
  usernameField: 'email' // <== this step we take because we don't use username but email to register and login users
  // if we use username we don't have to put this object:{ usernameField: 'email }
  },(email, password, next) => {
    User.findOne({ email })
    .then(userFromDb => {
      if(!userFromDb){
        return next(null, false, { message: 'Incorrect email!' })
      }
      if(userFromDb.password){
        if(!bcrypt.compareSync(password, userFromDb.password)){
          return next(null, false, { message: 'Incorrect password!' })
        }
      } else {
        return next(null, false, { message: 'This email is used for your social login.' })
      }
      return next(null, userFromDb)
    })
    .catch( err => next(err))
}))

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