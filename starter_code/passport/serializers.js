
const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user =>  cb(null,user))
        .catch(e => cb(e))
});