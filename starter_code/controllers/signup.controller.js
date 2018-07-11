const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.create = (req, res, next) => {
    res.render("passport/signup");
}

module.exports.doCreate = (req, res, next) => {
    //repeat
    console.log(req.body.email)
    User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.render('passport/signup', {
          user: req.body,
          errors: { email: 'Email already registered' }
        });
      } else {
        user = new User (req.body);
        return user.save()
          .then(user => {
            res.redirect('/');
          });
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('passport/signup', {
          user: req.body,
          errors: error.errors
        });
      } else {
        next(error);
      }
    })
}
