const passport = require("passport");

const User = require('../models/user');

// serialize: what information will we store in the session?
passport.serializeUser((userDetails, done) => {
  // "null" in the 1st argument means "no errors occurred"
  done(null, userDetails._id);
});

// deserialize: how will we get the full user details?
passport.deserializeUser((idFromSession, done) => {
  console.log("deSERIALIZE (details from session)");
  User.findById(idFromSession)
      .then((userDetails) => {
        done(null, userDetails);
      })
      .catch((err) => {
        done(err);
      });
});

function passportSetup (app) {
  // setting up these two middlewares
  // they add properties and methods to the 'req' object in routes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    // make 'req.user' accessible inside hbs files as 'blahUser' 
    res.locals.blahUser = req.user;
    next();
  });
}

module.exports = passportSetup;