//$ npm install passport passport-local express-session connect-mongo
const bcrypt = require("bcrypt")
const passport = require("passport")
const User = require("../models/User.model")

const LocalStrategy= require("passport-local").Strategy

passport.use( new LocalStrategy(
    {
        usernameField:"username",
        passwordField: "password"
    },
    async (username, password, done)=>{
        //encontrar username iguales
        const user=await User.findOne({username})
        //si no se encuentra el usuario
        if(!user){
            return (null, false, {message: "Incorrect username"})
        }
        //si la contraseña que le mandan está mal
        if(!bcrypt.compareSync(password, user.password)){
            return (null, false, { message: "Incorrect password" })
        }
        // si todo esta bien se manda a serializeUser
        done (null, user)
        }
    )
) 
//manda al user 
passport.serializeUser((user, cb)=>{
    cb(null, user._id)
})


passport.deserializeUser(async(id, cb)=>{
    const user =await User.findById(id)
    //borra password
    user.password=null
    cb(null, user)
})

module.exports = passport