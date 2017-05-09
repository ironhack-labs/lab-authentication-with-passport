const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

router.get('/signup',(req,res,next)=>{
  res.render('passport/signup.ejs');
})

router.get("/private-page", ensureLogin.ensureLoggedIn('/login'), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.post('/signup',(req,res,next)=>{

  const usernameInput=req.body.usernameInput;
  const pass=req.body.passwordInput;

  User.findOne(
    {username:usernameInput},
    {username:1},
    (err,theUser)=>{
      if (err) {
        next(err);
        return;
      }

      if (theUser) {
        res.render('passport/signup',{errorMessage:'User already exists. Please select another one.'});
        return;
      }

      const salt=bcrypt.genSaltSync(10);
      const hashPass=bcrypt.hashSync(pass,salt);

      const newUser=new User({
        username: usernameInput,
        password: hashPass
      });

      newUser.save((err)=>{
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
      });
    }
  );
});

router.get('/login',(req,res,next)=>{
  res.render('passport/login.ejs');
});

router.post('/login',passport.authenticate('local',
  {
      successRedirect:'/',
      failureRedirect:'/login'
  }
));

router.get('/logout',(req,res,next)=>{
  req.logout();
  res.redirect('/login');
});

module.exports = router;
