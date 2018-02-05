const passport = require("passport");
const User1 = require('../models/user');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
passport.deserializeUser((id, cb) => {
    User1.findOne({ "_id": id }, (err, user) => {
        if (err) { return cb(err); }
        cb(null, user);
    });
});