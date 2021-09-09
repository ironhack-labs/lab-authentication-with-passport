const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const passport = require("passport");

module.exports = (app) => {
  passport.serializeUser((user, cb) => cb(null, user._id));

  passport.deserializeUser((id, cb) => {
    User.findById(id)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  });

  passport.use(
    new LocalStrategy(
      // { passReqToCallback: true }, // >>>>>>> Why do it works when I comment this line ?¿? <<<<<<<<<
      {
        usernameField: "username", // by default
        passwordField: "password", // by default
      },
      (username, password, done) => {
        console.log(username);
        User.findOne({ username })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Incorrect username" });
            }
            if (!bcryptjs.compareSync(password, user.passwordHash)) {
              return done(null, false, { message: "Incorrect password" });
            }
            done(null, user);
          })
          .catch((err) => done(err));
      }
    )
  );
  app.use(passport.initialize());
  app.use(passport.session());
};
