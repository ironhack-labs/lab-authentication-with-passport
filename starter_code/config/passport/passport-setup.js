const passport = require("passport");

const User = require("../../models/user.js");


// serializeUser(): defines what user data to save in the session
// (happens when you log in successfully)
passport.serializeUser((userDoc, done) => {
  console.log("SERIALIZE (save user ID to session)");

  // "null" in the 1st argument tells Passport that there is "null" errors
  done(null, userDoc._id);
});

// deserializeUser(): defines how to retrieve the user information from the DB
// (happens automatically on EVERY request AFTER you log in)
passport.deserializeUser((userId, done) => {
  console.log("DESERIALIZE (retrieve user info from the DB)");

  User.findById(userId)
    .then(userDoc => {
      // "null" in the 1st argument tells Passport that there is "null" errors
      done(null, userDoc);
    })
    .catch(err => done(err));
});


function passportSetup (app) {
  // add Passport properties and methods to the "request" object in our ROUTES
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    // make "req.user" accessible inside hbs files as "currentUser"
    res.locals.currentUser = req.user;

    // "next()" means continue on to the next middleware (our routes)
    next();
  });
}


module.exports = passportSetup;