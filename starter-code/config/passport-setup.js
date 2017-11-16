const passport = require("passport");

const User = require("../models/user");

// serialize (what user info do we save to the session?)
// gets called when a user logs in (on our POST /process-login)
passport.serializeUser((userFromDb, cb) => {
  cb(null, userFromDb._id);
});

// deserialize (how do we retrieve the user details from the sessions?)
// gets called EVERY TIME you visit the page while you are logged in
passport.deserializeUser((idFromSession, cb) => {
  User.findById(idFromSession)
  .then((userFromDb) => {
    cb(null, userFromDb);
  })
  .catch((err) => {
    cb(err);
  });
});

// STRATEGIES (npm packages that enable additional methods of logging in)
