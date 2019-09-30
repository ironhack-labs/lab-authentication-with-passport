const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("../models/user");

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => {
      cb(null, user);
    })
    .catch(err => {
      cb(err);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "Incorrect Username" });
        }
        const isValidPas = bcrypt.compareSync(password, user.password);
        if (!isValidPas) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);

module.exports = passport;
