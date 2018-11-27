const passport = require("passport");
const User = require("../models/User");
//const FacebookStrategy = require("passport-facebook");


//local
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
