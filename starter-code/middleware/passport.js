const passport = require('passport')
const User = require('../models/user')
const { compareSync } = require('bcrypt')
const localStrategy = require('passport-local').Strategy

passport.serializeUser((user, cb) => {
  //recibe el usuario que se loggeó y se apoya del id para manejar la sesión
  //y envía el id al método deserializeUser
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  //recibe el id y verifica el usuario contra la DB
  // una vew que recibe el usuario, lo guarda en la propiedad user del request
  try{
    const user = await User.findById(id)
    cb(null, user)
  }catch(err){
    cb(err)
  }
})

passport.use(new localStrategy(async (username, password, next) => {
  try{
    const user = await User.findOne({username})
    if(!user){
      return next(null, false, { message: "Username doesn't exist"})
    }
    if(!compareSync(password, user.password)){
      return next(null, false, { message: 'Incorrect password'})
    }
    next(null, user) //El usuario se envía a serializeUser
  } catch(error){
    next(error)
  }
}))

module.exports = passport
