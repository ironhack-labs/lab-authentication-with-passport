const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

module.exports = (app) => {
    passport.serializeUser((user, cb) =>{
        cb(null, user._id);
    });

    passport.deserializeUser((id, cb) =>{
        User.findById(id)
            .then(user => cb(null, user))
            .catch((error) => cb(error));
    });

    // Local strategy
    passport.use(new LocalStrategy({passReqToCallback: true}, (req, username, password, next) =>{
        User.findOne({username})
            .then(user =>{                
                if (!user){
                    return next(null, false, {errorMessage: 'User or password incorrect'});
                }

                if(bcrypt.compareSync(password, user.password)){
                    console.log(user);
                    return next(null, user);
                } else {
                    return next(null, false, {errorMessage:'User or password incorrect'});
                }
            })
            .catch(error => next(error));
    }));

    // Github strategy
    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACKURL
    },
    function(accessToken, refreshToken, profile, done) {

        console.log(profile.id);

        User.findOne({gitHubID: profile.id})
        .then((user) => {
            if(user) {
                done(null, user);
                return;
            }

            User.create({gitHubID: profile.id, username: profile.username})
            .then((newUser) => {
                done(null, newUser);
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
};
