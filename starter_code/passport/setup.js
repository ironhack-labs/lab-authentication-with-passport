const passport = require('passport');

const User = require("../models/user.js");

// serialize: saving user data in the session
passport.serializeUser((userDoc, done) => {
  console.log("SERIALIZE (save to session)");

  //"null" in the 1st argument tells Passport "no errors occurred"
  done(null, userDoc._id);
});

// deserialize: retrieving the rest of the user data from the DB
// (happens automatically on every request AFTER you log in )
passport.deserializeUser((idFromSession, done) => {
  console.log("deSERIALIZE (details from database)");

  User.findById(idFromSession)
  .then((userDoc) => {
    //"null" in the 1st argument tells passport "no errors occurred"
    done(null, userDoc);
  })
  .catch((err) => {
    //"err" in the 1st argument tells Passport "there was an error"
    done(err);
  });
});

//app.js will call this function
function passportSetup (app) {
  //add Passport preperties & methods to the "req" object in our routes
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    //make "req.user" accessible inside hbs files as "blahUser"
    res.locals.oneUser = req.user;
    next();
  })
}

module.exports = passportSetup;