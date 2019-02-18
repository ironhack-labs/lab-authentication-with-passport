const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../../models/user');


passport.use(new LocalStrategy({
  usernameField: 'email' // <== this step we take because we don't use username but email to register and login users
  // if we use username we don't have to put this object:{ usernameField: 'email }
  },(email, password, next) => {
    User.findOne({ email })
    .then(userFromDb => {
      if(!userFromDb){
        return next(null, false, { message: 'Incorrect email!' })
      }
      if(userFromDb.password){
        if(!bcrypt.compareSync(password, userFromDb.password)){
          return next(null, false, { message: 'Incorrect password!' })
        }
      } else {
        return next(null, false, { message: 'This email is used for your social login.' })
      }
      return next(null, userFromDb)
    })
    .catch( err => next(err))
}))