const mongoose = require('mongoose')
const User = require('../models/user.model')


module.exports.signup = ((req, res, next) => {
  res.render('passport/signup.hbs')
})

module.exports.doSignup = ((req, res, next) => {

  function renderWithErrors(errors) {
    res.render('passport/signup', {
      user: req.body,
      errors: errors
    })
  }

  
  User.findOne({username: req.body.username})
    .then(user => {
      if (user){
        renderWithErrors({ username: 'Username is already registered' })
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
})