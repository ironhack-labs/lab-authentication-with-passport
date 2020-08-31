const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { compareSync } = require("bcrypt")
const User = require("../models/User.model")


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password" 
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user){
          return done(null, false, { message: "incorrect username" })
        }
        if (!compareSync(password, user.password)){
          return done(null, false, { message: "Incorrect password" })
        }
        done(null, user)
      } catch (error) {
        console.error(error)
        done(error)
      }
    }))


passport.serializeUser((user,done)=>{
  done(null, user._id)
})

passport.deserializeUser( async (id, done) => {
  try{
    const {email, username} =  await User.findById(id)
    done(null, {email, username})
  }catch(error){
    done(error)
  }
})

module.exports=passport