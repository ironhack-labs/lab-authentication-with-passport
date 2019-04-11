const mongoose = require('mongoose')
const User = require('../models/user.model')


module.exports.signup = ((req, res, next) => {
  res.render('passport/signup.hbs')
})

module.exports.doSignup = ((req, res, next) => {
  const username = req.params.username
})