const bcrypt = require("bcrypt")
const User = require("../models/User.model")
const passport = require("passport")

exports.signupView = (req, res) => res.render("auth/signup")

exports.signupProcess = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.render("auth/signup", {
      errorMessage: "Enter email and password"
    })
  }
  const user = await User.findOne({ email })
  if (user) {
    return res.render("auth/signup", {
      errorMessage: "Error"
    })
  }
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  await User.create({
    email,
    password: hashPass
  })
  res.redirect("/login")
}

exports.loginView = (req, res) => {
  res.render("auth/login")
}

// { errorMessage: req.flash("error")

exports.loginProcess = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
})

exports.privatePage = (req, res) => {
  res.render("private")
}

exports.logout = (req, res) => {
  req.logout()
  res.redirect("/login")
}