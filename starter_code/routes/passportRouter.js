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
  res.render("passport/private", { user: req.user });
});

router.get('/signup', (req, res, next)=>{
  res.render('passport/signup.hbs')
});

router.post('/process-signup', (req, res, next) => {
  const {username, password} = req.body;
  
  const salt = bcrypt.genSaltSync(10); 
  const encryptedPassword = bcrypt.hashSync(password, salt)

  User.create({username, encryptedPassword})
  .then(()=> {
    res.redirect('/');
  })
  .catch((err) => {
    next(err);
  });
});


router.get('/login', (req, res, next)=>{
  res.render('passport/login.hbs')
});

router.post('/process-login', (req, res, next) => {
  const {username, password} = req.body;
  User.findOne({ username })
  .then((userDetails)=>{
    if (!userDetails){
      res.redirect("/login");
      return;
    }
      req.login(userDetails, () =>{
      res.redirect("/");
    });
  })
  .catch((err) => {
    next(err);
  });

});

module.exports =  router;


