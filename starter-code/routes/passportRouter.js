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

router.get('/signup',(req,res,next)=>{
res.render('passport/signup'); 
});

router.post('/sign-up', (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  
  user.save (err => {
    if (err){
      return next(err);
    }
  
    res.redirect('/index')
  
  })
  
})


module.exports = router;
