const bcrypt = require("bcrypt")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/User.model")

passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        async (username, password, done) => {
            const user = await User.findOne({username})
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return done(null, false, { error: "Email or password incorrect"})
            }
            done(null, user) //send the user to a serializeUser
        }
    )
)

passport.serializeUser((user, callBack) => {
    callBack(null, user._id)
})

passport.deserializeUser(async (id, callBack) => {
    const user = await User.findById(id)
    user.password = null
    callBack(null, user)
})

module.exports = passport