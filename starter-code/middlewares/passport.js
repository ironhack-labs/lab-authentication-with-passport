const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, next) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return next(null, false, { message: "Incorrect Username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect Password" });
      }
      next(null, user);
    } catch (err) {
      next(err);
    }
  })
);
module.exports = passport;