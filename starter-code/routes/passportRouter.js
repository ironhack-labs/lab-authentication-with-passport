const express = require("express");
const passportRouter = express.Router();
const passport = require("passport")
const User = require('../models/user')
const bcrypt = require('bcrypt')
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body

  if(username === ''|| password === ''){
    return res.render('passport/signup', {
       message: 'Indicate username and password'
      })
  }

  const user = await User.findOne({ username })
  if(user !== null){
    return res.render('passport/signup', { message: 'The username already exists' })
  }
  //generamos el salt, que nos ayuda a hashear la contraseña 10 veces
  const salt = bcrypt.genSaltSync(10)
  //tomamos el password y lo hasheamos en función del salt
  const hashPass = bcrypt.hashSync(password, salt)

  const newUser = new User({
    username,
    password: hashPass
  })

  try {
    //esperamos a que se guarde el usuario y se continúa
    await newUser.save()
    return res.redirect('/')
  } catch (error) {
    res.render("passport/login", { "message": req.flash("error") })
  }

})

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
})


passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

//Utilizamos passport como middleware y su estrategia local

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
 });
module.exports = passportRouter