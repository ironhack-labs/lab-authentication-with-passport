const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const passport = require("../config/passport")

exports.signupView = (req, res) => res.render("auth/signup")

exports.signupProcess = async (req, res) => {
    const { username, password } = req.body
    if (username === "" || password === ""){
        return res.render("auth/signup", { error: "Missing fields" })
    }
    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return res.render ("auth/signup", {error: "Inavlid username"})
    }
    const salt = bcrypt.genSaltSync(12)
    const hashPswd = bcrypt.hashSync(password, salt)
    await User.create({
        username,
        password: hashPswd
    })
    res.redirect ("/auth/login")
}

exports.loginView = (req, res) => res.render("auth/login", { error: req.flash("error") })

exports.loginProcess = passport.authenticate("local", {
    successRedirect: "/auth/private",
    failureRedirect: "/auth/login",
    failureFlash: true
})

exports.private = (req, res) => {
    console.log(req.user)
    res.render("auth/private", req.user)
}
