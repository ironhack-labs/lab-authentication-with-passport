const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { checkedHashed } = require("../lib/hashing");
const asyncController = require("../lib/asyncController");

passport.use(
  new LocalStrategy(
    asyncController(async (username, password, done) => {
      const foundUser = await User.findOne({ username });
      if (foundUser) {
        checkedHashed(password, foundUser.password) ? done(null, foundUser) : done(null, false);
      } else {
        done(null, false);
      }
    })
  )
);
