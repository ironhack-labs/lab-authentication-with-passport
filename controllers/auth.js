// Require user model
const User = require('../models/User.model');
// Require bcrypt for encrypting passwords
const bcrypt = require('bcryptjs')

exports.signupView = (req, res) => {
    res.render('auth/signup');
}