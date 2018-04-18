const passport = require("passport");
const User     = require("../models/user");


passport.serializeUser((userDetails, done)=>{
  console.log('serialize (save to session)');
  done(null, userDetails.username) 
});


// used to deserialize the user
passport.deserializeUser(function(username, done) {
  console.log('deserialize (details from session)');
  User.findOne({username}, function(err, userDetails) {
      done(err, userDetails);
  });
});


function passportSetup(app){ 
  app.use(passport.initialize());
  app.use(passport.session());
  console.log("passport setup");

  // app.use((req, res, next) => {
  //   //make "req.user" accessible inside the hbs files as "BlahUser"
  //   res.locals.blahUser = req.user; //ce blahUser va etre utilisé dans le index.hbs
  //   next();
  // });
}

module.exports = passportSetup;