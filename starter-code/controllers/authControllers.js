const { genSaltSync, hashSync } = require('bcrypt')
const User = require('../models/user')

exports.getSignup = (req, res) => {
  res.render('passport/signup')
}

exports.postSignup = async (req, res) => {
  const { username, password } = req.body
  const salt = genSaltSync(15)
  const hashPasword = hashSync(password, salt)
  const user = await User.findOne({ username })

  if (username === '' || password === '') {
    return res.render('passport/signup', {
      message: 'please enter a user name and password'
    })
  }
  if (user !== null) {
    return res.render('passport/signup', {
      message: 'User already exists'
    })
  }
  await User.create({ username, password: hashPasword })
  res.redirect('/login', { message: req.flash('Error') })
}

exports.getLogin = (req, res) => {
  res.render('passport/login')
}
