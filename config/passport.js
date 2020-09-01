const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { compareSync } = require("bcrypt")
const User = require("../models/User.model")

passport.use(
    new LocalStrategy({
        usernameField: "username"
    },
        //
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if (!user)
                    return done(null, false, { message: "Incorrect username or password" })
                //
                if (!compareSync(password, user.password))
                    return done(null, false, { message: "Incorrect username or password" })
                done(null, user)
            }
            catch (error) {
                console.log(error)
                done(error)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        delete user.password
        done(null, user)
    }
    catch (error) {
        console.log(error)
    }
})

module.exports = passport