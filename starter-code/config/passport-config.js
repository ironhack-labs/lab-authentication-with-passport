const User              = require('../models/user-model');
const bcrypt            = require('bcrypt');
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const FbStrategy        = require('passport-facebook').Strategy;
const GloogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((userId, cb) => {
  // query the database with the user id
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }
    // sending the user's info to passport
    cb(null, theUser);
  });
});

//*****************************************************************
// passport LOCAL login strategy
//*****************************************************************
passport.use( new LocalStrategy(
  // 1st arg -> options to customize LocalStrategy
  {
      // <input name="loginUsername">
    usernameField: 'loginUsername',
      // <input name="loginPassword">
    passwordField: 'loginPassword'
  },
  // 2nd arg -> callback for the logic that validates the login
  (loginUsername, loginPassword, next) => {
    User.findOne(
      { username: loginUsername },

      (err, theUser) => {
        // Tell Passport if there was an error (nothing we can do)
        if (err) {
          next(err);
          return;
        }

        // Tell Passport if there is no user with given username
        if (!theUser) {
          next(null, false, { message: 'There was a problem, We cannot find that username' });
          return;  
        }          

        // Tell Passport if the passwords don't match
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          next(null, false, { message: 'There was a problem, your password is incorrect' });
          return;  
        }          

        // Give Passport the user's details (SUCCESS!)
        next(null, theUser, {
          // message -> req.flash('success')
          message: `Login successful.`
        });
      }
    );
  }
) );

//*****************************************************************
// passport FACEBOOK login strategy
//*****************************************************************
passport.use( new FbStrategy(
{               
    clientID: "FB_APP_ID", // app id from facebook developer page
    clientSecret: "FB_APP_SECRET", // secret id from facebook developer page
    callbackURL: '/auth/facebook/callback'
},
(accesToken, refreshToken, profile, don) => {
// only to save from this is the profile info

// always console.log when using 3rd parties
    console.log('FACEBOOK PROFILE ********************************');
    console.log(profile);
    console.log('');

    // look if the user already had loggin before or n
    User.findOne(
        { facebookID : profile.id },
        (err, foundUser) => {
            if(err){
                done(err);
                return;
            }
            // if user was found login
            if(foundUser){
                done(null, foundUser);
                return;
            }
            // if user wasn't found create a new facebook id
            // we will show profile id and username as displayName
            const theUser = new User({
                facebookID:  profile.id,
                name: profile.displayName,
            });

            theUser.save((err) => {
              if(err){
                done(err);
                return;
              }

              // save the user
              done(null, theUser);
            });

        }
    );
}

));

//*****************************************************************
// passport GOOGLE login strategy
//*****************************************************************
passport.use( new GloogleStrategy(
  {
    clientID: "GOOGLE_CLIENT_ID", // Google client ID
    clientSecret: "GOOGLE_CLIENT_SECRET", // //Google client secret
    callbackURL: '/auth/google/callback'
  },           //            |
               // address for a route in our app
  (accessToken, refreshToken, profile, done) => {
    console.log('');
    console.log('GOOGLE PROFILE ********************************');
    console.log(profile);
    console.log('');

    User.findOne(
      { googleID: profile.id },

      (err, foundUser) => {
        if (err) {
          done(err);
          return;
        }

        // If user is already registered, just log them in!
        if (foundUser) {
          done(null, foundUser);
          return;
        }

        // Register the user if they are not registered
        const theUser = new User({
          googleID: profile.id,
          name: profile.displayName
        });

        // If name is empty, save the email as the "name".
        if (!theUser.name) {
          theUser.name = profile.emails[0].value;
        }

        theUser.save((err) => {
          if (err) {
            done(err);
            return;
          }

          // This logs in the newly registered user
          done(null, theUser);
        });
      }
    );
  }
) );