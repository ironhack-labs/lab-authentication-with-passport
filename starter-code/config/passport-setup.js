const passport = require("passport");

const UserModel = require("../models/user");

passport.serializeUser((userFromDb, cb) => {

  cb(null, userFromDb._id);

});


passport.deserializeUser((idFromSession, cb) => {

    UserModel.findById(idFromSession)
    .then((userFromDb) => {

        cb(null, userFromDb);

    })
    .catch((err) => {
        cb(err);
    });
});
