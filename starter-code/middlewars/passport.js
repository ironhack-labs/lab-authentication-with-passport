const passport = require('passport')
const User = require('../models/User')
const {compareSync} = require('bcrypt')
const localStrategy = require('passport-local').Strategy
const slackStrategy = require('passport-slack').Strategy

passport.serializeUser((user, cb) => {
  // recibe el usuario que se logueo y se apoya del id para manejar la sesion
  // y envia el id al método deserializeUser
  cb(null, user._id)
})

passport.deserializeUser(async (id, cb) => {
  // recibe el id y verifica el usuario contra la DB
  // una vez que recibe el usuario lo guarda en la propiedad user del request
  // req.user= {_id='wertjwerbtwerwer', username: 'joss'}
  try {
    const user = await User.findById(id)
    cb(null, user)
  } catch (err) {
    cb(err)
  }
})

passport.use(
  new localStrategy(async (username, password, next) => {
    try {
      const user = await User.findOne({username})
      if (!user) {
        return next(null, false, {message: 'Incorrect username'})
      }
      if (!compareSync(password, user.password)) {
        return next(null, false, {message: 'Incorrect password'})
      }
      next(null, user) // el usuario se envía a serializeUser
    } catch (error) {
      next(error)
    }
  })
)