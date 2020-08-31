const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
    compareSync
} = require('bcryptjs');
const User = require('../models/User.model');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async(username, password, done) => {
        try {
            const user = await User.findOne({
                username
            });
            if (!user) return done(null, false, {
                message: "Username not correct"
            });
            if (!compareSync(password, user.password)) return done(null, false, {
                message: "Wrong password"
            })
            done(null, user)
        } catch (err) {
            done(err)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async(id, done) => {
    try {
        const {
            email
        } = await User.findById(id)
        done(null, {
            email
        })
    } catch (err) {
        done(err)
    }
})

module.exports = passport;