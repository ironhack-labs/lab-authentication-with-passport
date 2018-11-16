const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcryptjs');
const passport      = require('passport');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  // this function gets called everytime you write to req.user (edit req.user)
  
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  // this funciton gets called everytime you call req.user to read it 
  
 
  
  
  passport.use(new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));
  // this local strategy is the function that gets call when you call passport.authenticate('local' in the route)
  