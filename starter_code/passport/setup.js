const passport = require('passport');

const User = require('../models/user.js');

passport.serializeUser((userDoc, done)=>{
  console.log("SERIALIZE (save to session)");

  //null tells passport that no errors has occurred
  done(null, userDoc._id);
});

passport.deserializeUser((idFromSession, done)=>{
  console.log("deSERIALIZE (user data from the database");

  User.findById(idFromSession)
  .then((userDoc)=>{
    done (null, userDoc);
  })
  .catch(err =>{done(err)})
});


function passportSetup (app) {

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next)=>{
    res.locals.blahUser = req.user;

    //make the flash messages available inside the views
    res.locals.messages = req.flash();
    
    next();
  });
}

module.exports = passportSetup;