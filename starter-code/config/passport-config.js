const passport = require('passport');
const User = require('../models/user.js');
const bcrypt        = require("bcrypt");


passport.serializeUser((userFromDb, done) => {


  done(null, userFromDb._id);


});


passport.deserializeUser((idFromBowl, done) => {
  User.findById(
    idFromBowl,

    (err, userFromDb) => {
      // if there's a database error, inform passport
      if(err) {
        done(err);
        return;
      }

      done(null, userFromDb);

    }
  );
});



const LocalStrategy = require('passport-local').Strategy;
// "passport.use() sets up a new strategy"
passport.use(
  new LocalStrategy(
    // 1st arg -> settings object
    {
        usernameField: 'signupUser',
        passwordField: 'signupPassword'
    },

    (emailValue, passValue, done) => {

        // find the user in the Db with that email

        console.log('the email' + emailValue);
        console.log('the pass ' + passValue);
        User.findOne(
          {username: emailValue},
          (err, userFromDb) => {
            if (err) {
              done(err);
              return;
            }
            // console.log(userFromDb);
            // console.log('Cow got to here');
            console.log('theuser' + userFromDb);
            if(userFromDb === null) {
                console.log(userFromDb);
                console.log("Wrong Username");
              done(null, false, { message: 'Username is wrong. 💩' });
              return;
            }


            const isGoodPassword = bcrypt.compareSync(passValue, userFromDb.password);

              if (isGoodPassword === false) {


                done(null, false, { message: 'Password is wrong. 💩' });
                return;
              }

            done(null, userFromDb);
            return;
          }
        ); // close UserModel.findOne( ....)
    }
  ) // close new LocalStrategy
);
