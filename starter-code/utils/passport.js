const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

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
        function(username, password, done) {
            User.findOne({ username }, function(err, user) {
                if (err) {
                    return done(err)
                }

                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' })
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