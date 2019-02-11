const User = require('../models/user')
let passport = require('passport')

passport.use(User.createStrategy()) //primer estrategia (local)

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Paso 2
//dont forget to export PASSPORT
module.exports = passport