const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt =require('bcrypt')

// Add passport 
const passport = require('passport')


//Sign up routes
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', async(req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const salt = bcrypt.genSaltSync(10)
const hashPass = bcrypt.hashSync(password, salt)

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
  
  const users = await User.find({username})

  if(users.length !== 0){
    return res.render('passport/signup', {
      message: 'User already exists'
    })
  }

  User.create({
    username,
    password: hashPass
  })
  .then(()=>{
    res.redirect('/')
  })
  .catch(()=>{
    console.log(error)
  })

})

//login routes
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "passport/login",
  failureFlash: true,
  passReqToCallback: true
}));


//Protected routes
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;