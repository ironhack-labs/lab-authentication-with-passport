const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }

        const cleanUser = user.toObject();
        delete cleanUser.password;

        cb(null, cleanUser);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne({ username }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (!user.password) {
                    return done(null, false, {
                        message: 'Password not set, please set the password.'
                    });
                }

                const passwordsMatch = bcrypt.compareSync(password, user.password);
                if (!passwordsMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/cb'
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const email = profile.emails[0].value;
            const username = profile.name.givenName;
            User.findOne({ $or: [{ googleId: profile.id }, { email }] })
                .then(user => {
                    if (user) {
                        if (!user.googleId) user.googleId = profile.id;
                        if (!user.username) user.username = username;
                        user.save(() => {});

                        return done(null, user);
                    }

                    const newUser = new User({
                        googleId: profile.id,
                        email,
                        username
                    });

                    newUser.save().then(user => {
                        done(null, newUser);
                    });
                })
                .catch(error => {
                    done(error);
                });
        }
    )
);
