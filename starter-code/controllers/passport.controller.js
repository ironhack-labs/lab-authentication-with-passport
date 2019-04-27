const User = require('../models/user');
const passport = require('passport');

//module.exports = (req, res, next) => {
//  res.render('passport/private', { user: req.user });
//};

module.exports.signUpForm = (req, res, next) => {
  res.render('passport/signup');
}

module.exports.signupCreate = (req, res, next) => {
  const user = new User({
    username:req.body.username,
    password:req.body.password
  })
  user.save()
  .then (user => {
    res.redirect('/login')
  })
  .catch(error => next(error))
}

module.exports.loginForm = (req, res, next) => {
  res.render('passport/login')
}

module.exports.loginAccess = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validation) => {
    if(error) {
      next(error);
    } else if (!user) {
      res.render('passport/login', {
        username: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if(error) {
          next(error)
        } else {
          res.redirect ('/user');
        }
      })
    }
  })(req, res, next)
}