const passport = require("passport");

//for deserialized, need to do a DB query
const User = require("../models/user");

//serialize - login, save user info in session when they log in.
//deserialize - after login (on every request), search for the full details of the user

// seraialize: what information will we store in the session?
passport.serializeUser((userDetails, done) => {
    console.log("SERIALIZE (save to session");
    // "null" is the 1st argument tells passport "no errors occurred"
    done(null, userDetails._id);
});

// seraialize: how will we get the full user details?
passport.deserializeUser((idFromSession, done) => {
    console.log("deSERIALIZE (details from session");
    User.findById(idFromSession) // to get information about user
    .then((userDetails) => {
        done(null, userDetails); // telling passport there is no error, and here are the user details
    })
    .catch((err) => {
        done(err);
    });
});

function passportSetup (app) {
    //console.log("PASSPORT SETUP")
    //add properties and methods to the "req" object in routes
    app.use(passport.initialize()); //middlewares, will add something extra to the request otion to help us manage the session a little easier
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });
}

module.exports = passportSetup;
