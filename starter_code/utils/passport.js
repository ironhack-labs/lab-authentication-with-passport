const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('../config')

passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err)
        }

        const cleanUser = user.toObject()
        delete cleanUser.password

        cb(null, cleanUser)
    })
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({ email }, function(err, user) {
                if (err) {
                    return done(err)
                }

                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' })
                }

                if (!user.password) {
                    return done(null, false, {
                        message: 'Password not set, please contact support or log in with social.'
                    })
                }

                const passwordsMatch = bcrypt.compareSync(password, user.password)
                if (!passwordsMatch) {
                    return done(null, false, { message: 'Incorrect password.' })
                }
                return done(null, user)
            })
        }
    )
)
