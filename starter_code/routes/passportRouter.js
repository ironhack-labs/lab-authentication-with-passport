const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", { user: req.user });	    res.render("passport/private", {user: req.user});
  }); 

router.get('/signup',(req,res,next)=>{

  res.render('passport/signup');

})


router.post('/signup', (req,res,next)=>{
  const thePassword = req.body.thePassword;
  const theUsername = req.body.theUsername;
  
  if (thePassword === "" || theUsername === ""){
    res.render('passport/signup', {errorMessage: 'Please fill in the required info'})
    return;
  }
  
  User.findOne({'username': theUsername})
  .then((responseFromDB)=>{
    if (responseFromDB !== null){
      res.render('passport/signup', {errorMessage: 'username taken'})
      return;
    }
  
  
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(thePassword, salt);

  User.create({username: theUsername, password: hashedPassword})
  .then((response)=>{
    res.redirect('/')
  })
  .catch((err)=>{
    next(err)
   })
  })
})


router.get('/login',(req,res,next)=>{

  res.render('passport/login', {message: req.flash('error')});

})


router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/logout', (req,res,next)=>{
  req.logout();
  res.redirect('login')
});


module.exports = router