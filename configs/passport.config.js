const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')
const flash = require('connect-flash')

module.exports = (app) =>{
    passport.serializeUser((user, cb) => {cb(null, user._id)});
    passport.deserializeUser((id, cb) =>{
        User.findById(id)
        .then((user) => cb(null, user))
        .catch(error => cb(error))
    })
    app.use(flash());

    passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
        User.findOne({ username })
          .then(user => {
            if (!user) {
              return next(null, false, { errorMessage: 'Usuario o contraseña incorrectos' });
            }
    
            if (bcrypt.compareSync(password, user.password)) {
              return next(null, user);
            } else {
              return next(null, false, { errorMessage: 'Usuario o contraseña incorrectos.' })
            }
          })
          .catch(error => next(error))
      }))
    app.use(passport.initialize());
    app.use(passport.session());
}
