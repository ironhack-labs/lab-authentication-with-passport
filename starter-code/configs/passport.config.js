require('dotenv').config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const Users = require("../models/Users");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  Users.findById(id, (err, user) => {
    if(err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use('local-auth', new LocalStrategy((username, password, next) => {
  Users.findOne({ username }, (err, user) => {
    if(err) {
      return next(err);
    }
    if(!user) {
      return next(null, false, {message: 'Incorrect username or password'});
    }
    if(!bcrypt.compareSync(password, user.password)) {
      return next(null, false, {message: 'Incorrect username or password'});
    }
    return next(null, user);
  });
}));

passport.use(
  new GoogleStrategy({
    clientID: `${process.env.GOOGLE_ID}`,
    clientSecret: `${process.env.GOOGLE_SECRET}`,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    Users.findOne({googleID: profile.id})
    .then(user => {
      if(user) {
        done(nulle, user);
        return
      }
      Users.create({googleID: profile.id, username: profile.email})
      .then(newUser => {
        done(null, newUser)
      })
      .catch(err => done(err))
    })
    .catch(err => done(err))
  }
  )
  
)