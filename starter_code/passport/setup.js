const passport = require('passport');

const User = require("../models/user");

passport.serializeUser((userDetails, done)=>{
  done(null, userDetails._id);
});

passport.deserializeUser((idFromSession, done)=>{
  User.findById(idFromSession)
    .then((userDetails)=>{
        done(null, userDetails);
    })
    .catch((err)=>{
      done(err);
    });
});

function passportSetup(app) {

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req,res,next) => {
    res.locals.blahUser = req.user;
    next();
  });
}


module.exports = passportSetup;