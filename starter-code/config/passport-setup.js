const passport = require("passport");

const UserModel = require("../models/user");





// serializr ( what user information do we save to the session?)
//-------------------------------------------------------------
//  gets called when a user logs in( on our POST /process-login)
passport.serializeUser((userFromDb, cb) => {
     //null is for saying "no errors occurred" during the serialize process
     //  |
     cb(null, userFromDb._id);
     //                   /
     // save only the "_id"  of the user
});
//deserialize(how we do retieve the user details form the session)
//-------------------------------------------------------------
//  gets called "every time" you visit thee page on the site while you are logged in
// (that's so we can potentiall personalize all page)
passport.deserializeUser((idFromSession, cb) => {
  // find the user's document by the ID we saved in the session
    UserModel.findById(idFromSession)
    .then((userFromDb) => {
      //null is for saying "no errors occurred" during the serialize process
      //  |
      cb(null, userFromDb);
      //          |
      // send Passport the logged in user's info
    })
    .catch((err) => {
      cb(err);
    });
});
//STRATEGIES (npm package that enable other methods of logging)
