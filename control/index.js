const User = require("../models/User.model")
const { hashSync, genSaltSync } = require("bcrypt")
const passport = require("../config/passport")

//signup
exports.signupView = (req, res) =>{
  res.render("auth/signup")
}
exports.signupProcess = async(req, res)=>{
  const {username, email, password} = req.body;
  if(username==="" || email==="" || password===""){
    res.render("auth/signup", {error : "Te faltan los datos!!"})
  }
  const existingUser = await User.findOne({email})
  if(existingUser){
    return res.render("auth/signup", {error : "Username o email ya esta en uso"})
  }
  const hashPass = hashSync (password, genSaltSync(12))
  await User.create({
    username,
    email,
    password : hashPass
  })
  res.redirect("/auth/login")
}


//login
exports.loginView = (req, res) =>{
  res.render("auth/login")
}

exports.loginProcess = passport.authenticate("local", {
  successRedirect: "/auth/private",
  failureRedirect: "/auth/login",
})


exports.logout = (req, res)=>{
  req.logout();
  res.redirect("/auth/login")
}
