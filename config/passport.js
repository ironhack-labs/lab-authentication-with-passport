const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User")

passport.use(
    new LocalStrategy({
            usernameField: "username",
            passwordField: "password"
        },
        async(username, password, done) => {
            const user = await User.findOne({ username })
            if (!user) {
                return done(null, false, { message: "Incorrect username" })
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: "Incorrect password" })
            }

            done(null, user)
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id)
    user.password = null
    done(null, user)
})

module.exports = passport