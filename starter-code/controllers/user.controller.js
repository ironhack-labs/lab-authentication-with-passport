const User = require('../models/user');

module.exports.access = (req, res, next) => {
  res.redirect('/');
}

module.exports.privatePage = (req,res,next) => {
  User.findOne({username: req.user.username})
    .then(user => {
      res.render('passport/private', {user});
    })
    .catch(error => next(error))
}