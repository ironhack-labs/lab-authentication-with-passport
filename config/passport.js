const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { compareSync } = require("bcrypt")
const User = require("../models/User.model.js")


passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password"
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username })
                if(!user) return done(null, false, { message: "incorrect username"})

                if (!compareSync(password, user.password))
                return done(null, false, {message: "Incorrect Password"})

            done(null, user)
            }catch(error){
                console.error(error)
                done(error) 
            }
        }
    )
)

passport.serializeUser((user,done)=>{
    done(null, user._id)
})

passport.deserializeUser(async (id,done) => {
    try{
        const { username } = await User.findById(id)
        done(null, { username })
    } catch (error) {
        done(error)
    }
})

module.exports = passport