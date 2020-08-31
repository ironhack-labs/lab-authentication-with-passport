const User = require("../models/User.model")
const { hashSync, genSaltSync } = require("bcrypt")
const passport = require("../config/passport")

exports.getSignUp = (req, res) => {
    res.render("auth/signup")
  }
  
exports.postSignUp = async (req, res) => {
    const { email, password } = req.body
    if (email === "" || password === "") {
        return res.render("auth/signup", { error: "Missing fields." })
    }

    const existingUser = await User.findOne({ username: email })
    if (existingUser) {
        return res.render("auth/signup", { error: "Error, try again." })
    }
    const hashPwd = hashSync(password, genSaltSync(12))
    await User.create({
        username: email,
        password: hashPwd
    })
    res.redirect("login")
}

exports.getLogin = (req,res,next)=>{
    res.render("auth/login")
};

exports.postLogin = passport.authenticate("local", {
    successRedirect: "/auth/private",
    failureRedirect: "login",
    failureFlash: true
  })
  

exports.getPrivate = (req,res,next)=>{
    let user = req.user;
    res.render("auth/private", {user})
};


exports.logout = (req, res) => {
    req.logout()
    res.redirect("/")
  }