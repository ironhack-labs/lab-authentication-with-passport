const passport = require("passport");

const User = require ("../models/user");

function passportSetup (app) {
  // add properties & methods to the "req" object in toutes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    //make "req.user" accessible inside hbs files as "blahUser"
    res.locals.blahUser = req.user;
    next();
  })
}

module.exports = passportSetup;
