const passport = require('passport');
const User = require('../models/User');

//Este archivo es para crear la estrategia local

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;