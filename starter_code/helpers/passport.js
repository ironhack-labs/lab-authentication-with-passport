
//Este archivo crea la estrategia local

const passport = require ('passport');
const User = require ('../models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // Guardarlo en la base de datos (serializer los busca en la BD)
passport.deserializeUser(User.deserializeUser()); // 

module.exports=passport;