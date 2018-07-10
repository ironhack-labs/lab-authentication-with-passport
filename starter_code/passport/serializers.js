const User = require('../models/user');
const passport = require('passport');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});