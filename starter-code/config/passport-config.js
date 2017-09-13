const passport = require('passport');
const User     = require('../models/user.js');
const bcrypt   = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((userFromDb, done) => {
  done(null, userFromDb._id);
});

passport.deserializeUser((idFromBowl, done) => {
  User.findById(
    idFromBowl,
    (err, userFromDb) => {
      if(err){
        done(err);
        return;
      }
      done(null, userFromDb);
    }
  )
})

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'loginPassword'
    },
    (usernameValue, passValue, done) => {

      User.findOne(
        {username: usernameValue },

        (err, userFromDb) => {
          if (err) {
            done(err);
            return;
          }

          if(userFromDb === null) {
            done(null, false, { message: 'Incorrect Email, Try Again.'});
            return;

        }

        done(null, userFromDb);
      }
      )
})
)
