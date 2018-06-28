const passport  = require('passport');

const User      = require('../models/user.js');


// serialize : saving user data in the session
passport.serializeUser((userDoc,done) => {
    console.log("SERIALIZE (save to session)");

    // "null" in the 1st argument tells Passport "no errors occured"
    done(null,userDoc._id);
});

// deserialize : retrieving the rest of the user data from the database
// (happens automatically on every request after you log in)
passport.deserializeUser((idFromSession,done) => {
    console.log("deSERIALIZE (user data from the database)");
    User.findById(idFromSession)
    .then((userDoc)=>{
        // "null" in the 1st argument tells Passport "no errors occurred"
        done(null,userDoc);
    })
    .catch((err)=>{
        // "err" in the 1st argument tells Passport "there was an error"
        next(err);
    })

});

// "app.js" will call this function
function passportSetup(app){
    // add Passport proprieties & methods to the "req" object in our routes
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req,res,next)=>{
        // make "req.user" accessible inside hbs files as "blahUser"
        res.locals.blahUser = req.user;

        // make flash messages accessible inside hbs files as "messages"
        // res.locals.messages = req.flash();

        next();
    });
}
module.exports = passportSetup;