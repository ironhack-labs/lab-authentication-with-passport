const passport = require("passport");
const user = require("../models/user");

passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

module.exports = passport;