const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.serializeUser( (user, cb) => {

  cb(null, user._id);
  
});

passport.deserializeUser( (id, cb) => {

  User.findById(id)
  .then( user => {
    cb(null, user);
  })
  .catch( error => cb(error) );

});

passport.use( new LocalStrategy( (username, password, next) => {
  User.findOne({ username })
  .then( user => {

    if ( !user ) return next(null, false, { message: 'There is no user registered with that username' });

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if ( !isValidPassword ) return next(null, false, { message: 'Incorrect password' });

    return next(null, user);

  })
  .catch( error => next( error ));

}));

module.exports = passport;