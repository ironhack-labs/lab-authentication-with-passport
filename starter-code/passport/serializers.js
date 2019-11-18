const passport = require("passport");
const User = require("../models/User");

passport.serializeUser((user, cb) => {
    console.log("serialize");
    console.log(`storing ${user._id} in the session`);
    cb(null, user._id);
    // cb(null, {id: user._id, role: user.role});
});

passport.deserializeUser((id, cb) => {
    console.log("deserialize");
    console.log(`Attaching ${id} to req.user`);
    // eslint-disable-next-line consistent-return
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});