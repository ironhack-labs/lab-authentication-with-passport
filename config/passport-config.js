const passport = require('passport');
const User = require('../models/user-model.js');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});



passport.deserializeUser((userId, cb) => {
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, theUser);
  });
});



passport.use( new LocalStrategy (
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'

  },

  (loginUsername, loginPassword, next) => {
      User.findOne({ username: loginUsername }, (err, theUser) => {
        if (err) {
          next(err);
          return;
        }

        if (!theUser) {
          next(null, false, { message: 'Wrong username, buddy'});
          return;
        }

        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          next(null, false, {message: 'Wrong passport, friend!'});
          return;
        }

        next(null, theUser, {
          message: `Login for ${theUser.username} succesful.`
        });
      });
  }
));

passport.use(new FbStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log('');
  console.log(`FACEBOOK PROFILE ----------------`);
  console.log(profile);
  console.log('');

  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      facebookID: profile.id,
      name: profile.displayName,
      pic_path: `http://graph.facebook.com/{ profile.id }/picture?type=square`
    });

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  console.log('');
  console.log(`GOOGLE PROFILE ----------------`);
  console.log(profile);
  console.log('');


  User.findOne({ googleID: profile.id }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, user);
    }

    const newUser = new User({
      googleID: profile.id
    });

    if(!newUser.name) {
      newUser.name = profile.emails[0].value;
    }

    newUser.save((err) => {
      if (err) {
        return done(err);
      }
      done(null, newUser);
    });
  });

}));
