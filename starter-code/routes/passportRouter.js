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

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
const salt = bcrypt.genSaltSync(10);
const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);
const theUser = new User({
  username: req.body.signupUser,
  password: scrambledPassword
});
theUser.save()
res.redirect('/');
});



router.get("/login",(req, res, next)=>{
res.render('passport/login');
});

router.post(("/login"), (req, res, next) =>{
  //req.body.loginUsername
  //req.body.loginPassword
  User.findOne({username:req.body.loginUsername})
    .then(userFromDb => {
      const correctPassword = bcrypt.compareSync(req.body.loginPassword, userFromDb.password);
      if(!userFromDb || !correctPassword){
        res.render('/');
        return;
      }
      req.login(userFromDb, error => {
      if(error){
        next(error);
      }else{
        res.redirect('/private-page');
      }
    });
  }).catch(error => {
      next(error);
    });
});

module.exports = router;
