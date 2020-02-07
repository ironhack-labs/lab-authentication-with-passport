const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const model = require("../../models/user");
const { checkHashed } = require("../../lib/hashing");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const foundUser = await model.findOne({ username });
      if (foundUser) {
        checkHashed(password, foundUser.password)
          ? done(null, foundUser)
          : done(null, false);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  })
);
console.log("Installed Passport Local Strategy");
