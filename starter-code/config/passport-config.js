const passport = require('passport');
const User = require('../models/user.js');


passport.serializeUser((userFromDb, done) => {
      // tell passport we want to save the ID inside the session
      //                   |
    done(null, userFromDb._id);
      //   |
      // "null" as the first argument means "no error" (good)
});

passport.deserializeUser((idFromBowl, done) => {
    User.findById(
      idFromBowl,

      (err, userFromDb) => {
          // if there's a database error, inform passport.
          if (err) {
              done(err);
              return;
          }

            // give passport the user document from the database
            //            |
          done(null, userFromDb);
            //   |
            // "null" as the first argument means "no error" (good)
      }
    );
});

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// "passport.use()" sets up a new strategy
passport.use(
  new LocalStrategy(
    // 1st arg -> settings object
    {
        usernameField: 'loginUsername',
        passwordField: 'loginPassword'
    }, //     |              |
       //     |         names of your input fields
       // settings defined by LocalStrategy

    // 2nd arg -> callback
    (usernameValue, passValue, done) => {
        // find the user in the DB with that email
        User.findOne(
          { username: usernameValue },

          (err, userFromDb) => {
              if (err) {
                  done(err);
                  console.log('problem 1');
                  return;

              }

              // "userFromDb" will be "null" if we didn't find anything
              if (userFromDb === null) {
                    // "null" here again means "no error"
                    //  |  LOGIN FAILED (email is wrong)
                    //  |      |
                  done(null, false, { message: 'Username is wrong.' });
                  console.log('problem 2');
                  return;
              }

              // confirm that the password is correct
              const isGoodPassword =
                  bcrypt.compareSync(passValue, userFromDb.password);

              if (isGoodPassword === false) {
                    // "null" here again means "no error"
                    //  |  LOGIN FAILED (password is wrong)
                    //  |      |
                  done(null, false, { message: 'Password is wrong. 💩' });
                  console.log('problem 3');
                  return;
              }
              console.log('done');

              // if everything works, send passport the user document.
              done(null, userFromDb);
                //           |
                // passport takes "userFromDb" and calls "serializeUser"
          }
        ); // close UserModel.findOne( ...
    }
  ) // close new LocalStrategy( ...
);
