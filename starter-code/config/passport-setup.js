const passport = require("passport");

const UserModel = require("../models/user");

// serialize (what user information do we save to the session?)
// gets called when a user logs in
passport.serializeUser((userFromDb, callback) => {
  callback(null, userFromDb._id);
});

// deserialize
// gets called EVERY TIME you visit a page on the site while you are logged in
// (that's so we can personalize all pages)
passport.deserializeUser((idFromSession, callback) => {
  UserModel.findById(idFromSession)
    .then((userFromDb) => {
      callback(null, userFromDb);
    })
    .catch((err) => {
      callback(err);
    });
});


// STRATEGIES (npm packages that enable additional methods of logging in)
