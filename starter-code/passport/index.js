const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    return cb(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true
    },
    async (req, username, password, next) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          //verificación
          return next(null, false, { message: 'Incorrect username' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          //verificación
          return next(null, false, { message: 'Incorrect password' });
        }

        return next(null, user);
      } catch (err) {
        return next(err);
      }
    }
  )
);

module.exports = passport;
