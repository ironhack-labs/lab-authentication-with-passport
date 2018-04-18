const passport = require("passport");

const User = require("../models/user");

passport.serializeUser(( userDetails, done ) => {
    // serialize: what information will we store in the session?
    console.log( "SERIALIZE (save to session)");
    
        done( null, userDetails._id );
        // "null" in the 1st position means "no errors occured"
        // There can be no error while serializing
    });
    

passport.deserializeUser(( idFromSession, done ) => {
    // deserialize: how will we get the full user details?
    console.log( "deSERIALIZE (details from session)");
    
        User.findById( idFromSession )
            .then(( userDetails ) => {
                done( null, userDetails );
                // "null" in the 1st position means "no errors occured"
            })
            .catch(( err ) => {
                next( err );
            })
    });

function passportSetup (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.luke = req.user;
        next();
    });
}

module.exports = passportSetup;