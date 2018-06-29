const passport = require("passport");

const User = require("../models/user.js");

passport.serializeUser((userDoc, done) => {
  console.log("SERIALIZE (save to session");
  done(null, userDoc._id);
});

passport.deserializeUser((idFromSession, done) => {
  console.log("deSERIALIZE (user data from the database");

  User.findById(idFromSession)
    .then((userDoc) => {
      done(null, userDoc);      
    })
    .catch((err) => {
      done(err);
    });
});


function passportSetup (app) {
  app.use(passport.initialize())
  app.use(passport.session())
//make req user accessible
  app.use((req, res, next) => {
    res.locals.blahUser = req.user;
//make flash messages acessible inside hbs files as messages
    //res.locals.messages = req.flash()
    next();
  });
}


module.exports = passportSetup;
