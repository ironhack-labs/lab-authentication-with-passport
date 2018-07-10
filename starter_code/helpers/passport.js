const passport = require('passport');
const User = require('../models/User');

passport.use(User.createStrategy());//los ifs del login que comprueba
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;