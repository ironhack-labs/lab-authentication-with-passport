const passport = require("passport");

const UserModel = require("../models/user");


passport.serializeUser( (userFromDb, callback) => {
    callback(null, userFromDb._id);
});

passport.deserializeUser( (idFromSession, callback) => {
    UserModel.findById(idFromSession)
        .then( (userFromDb) => {
            callback(null, userFromDb);

        })
        .catch( (err) => {
            callback(err);
        });
});
