const bcrypt = require("bcrypt")
const User = require("../models/User.model")
const passport = require("../config/passport")



  exports.signupView = (req,res) => res.render("auth/signup") //SIGNUPVIEW

exports.signupProcess =async(req, res) => {
  const {email, password} = req.body

  if(!email || !password){
    return res.render("auth/signup",{
      errorMessage: "Indicate email and password"
    })
}

const user = await User.findOne({ email})
if(user){
  return res.render("auth/signup",{
    errorMessage: "Error"
  })
}
      //verificamos existencia de usario
const salt = bcrypt.genSaltSync(12)
const hashPass = bcrypt.hashSync(password,salt)
      //creamos usuario

      await User.create({
        email,
        password:hashPass
      })
     
      res.redirect("/login")

    }

//LOGINVIEW
exports.loginView = (req,res) => {
  res.render("auth/login", {errorMessage: "error"})
}

exports.loginProcess = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect:"/login",
  failureFlash:true
})

exports.privatePage = (req, res) => {
    res.render("private")
  }

    //desloggeamos
 exports.logout = (req,res) => {
   req.logout()
   res.redirect("/login")
 }   