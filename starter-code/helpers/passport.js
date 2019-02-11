let User = require('../models/user')
let passport = require('passport')
//bajando pasport para configurarlo en este archivo y depues exportarlo configurado



passport.use(User.createStrategy()) //primera estrategia: local
passport.serializeUser(User.serializeUser()) //como guardar
passport.deserializeUser((User.deserializeUser())) //como sacar


module.exports = passport