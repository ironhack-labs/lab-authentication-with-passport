const bcrypt = require("bcrypt")
const User = require("../models/User.model")
const passport =require("../config/passport")

exports.signupView=(req, res)=> res.render('auth/signup')

exports.signupProcess= async (req, res) => {
//saca info de la form por medio de destructuración de name
const {username, password}=req.body
//checar que completen la info de entrada
if(!username||!password){
    //regresa a signup con mensaje de error
    return res.render('auth/signup', {errorMessage: "Indicate email or password"})
}
//checar que no esté registrado con ese username
//buscar en base de datos 
const user = await User.findOne({username})
if(user){
    return res.render('auth/signup', {errorMessage: "Username not available"})
}
//pero si el usuario dio la info correcta o no esta registrado 
else{
//tenemos que crear un nuevo user y darle una info hasheada
const salt= bcrypt.genSaltSync(12)
const hashPass=bcrypt.hashSync(password, salt)
await  User.create({
    username,
    password:hashPass
})
console.log('user created')
res.redirect("/login",)
}
}

//setup login views and process
//setup passport
exports.loginView=(req, res)=> res.render('auth/login', { errorMessage: req.flash("error") })

  exports.loginProcess =passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true
})


exports.privatePage=(req, res)=>{
    res.render("auth/private")
}

exports.logout = (req, res) => {
    req.logout()
    res.redirect("/login")
  }
