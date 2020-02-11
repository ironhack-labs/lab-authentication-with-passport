const passport = require("passport");
const User = require("../../models/User");

const { hashPassword, checkHashedPassword } = require("../../lib/hashing");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ username });
        user
          ? checkHashedPassword(password, user.password)
            ? done(null, user)
            : done(null, false)
          : done(null, false);
      } catch (error) {
        done(error);
      }
    }
  )
);
