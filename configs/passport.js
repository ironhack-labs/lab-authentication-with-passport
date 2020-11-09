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
            if (!user){
                return done(null, false, {message: "Incorret email!"})
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, {message: "Incorrect password"})
            }

            done(null, user) 
        }
    )
)

passport.serializeUser((user, callback)=> {
    callback(null, user._id)
})

passport.deserializeUser(async (id, callback) => {
    const user =await User.findById(id)
    user.password =null
    callback(null, user)
})

module.exports = passport