const User = require('../models/user');
const createError = require('http-errors');

module.exports.list = (req, res, next) => {
  User.find()
    .then(users => {
      res.render('users/list', { users });
    })
    .catch(error => next(error));
}

module.exports.delete = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user) {
        next(createError(404, 'User not found'))
      } else {
        res.redirect('/users');
      }
    })
    .catch(error => next(error));
}