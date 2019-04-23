const express        = require("express");
const passportRouter = express.Router();
const User           = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

// get y post para para traer el signup
passportRouter.get('/signup', (req,res) =>{
  res.render ('passport/signup')
})

passportRouter.post('/signup', async (req,res) =>{
  const {username, password} = req.body

  if(username === '' || password ===  ''){
    return res.render ('passport/signup',{
      message: "Indicate username and password"
    })
  }
  
  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }
  })
  //generamos el salt, que nos ayuda a hashear la contraseña
  const salt = bcrypt.genSaltSync(10)
   const hashPass = bcrypt.hashSync(password, salt);
  
   const newUser = new User({
    username,
    password: hashPass
  });
  try {
    //solamente espero a que se guarde el usuario  y continuo con el proceso
    await newUser.save()
    res.redirect('/')
  } catch (error){
    res.render('passport/signup',{
      message: "Something went wrong"
    })
  }
})
// get y post de login
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login",{ "message": req.flash("error") });
});


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

// Require user model

// Add bcrypt to encrypt passwords

// Add passport 


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;