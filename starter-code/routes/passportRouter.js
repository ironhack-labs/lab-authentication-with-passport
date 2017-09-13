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
  res.locals.unsuccessful = req.flash('unsuccessful');
  res.render('passport/signup');
});

router.post('/signup-process', (req, res, next)=>{
  if(req.body.username === "" || req.body.password === ""){
    req.flash("unsuccessful", "Both a username and password is required.");
    res.redirect('/signup');
    return;
  }
  User.findOne(
    {username: req.body.username},
    (err, userFromDb)=>{
      if(err){
        next(err);
        return;
      }
      if(userFromDb){
        req.flash("unsuccessful", "This username already exist.");
        res.redirect('/signup');
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User ({
        username: req.body.username,
        password: password
      });

      newUser.save((err)=>{
        if(err){
          next(err);
          return;
        }
        req.flash("successful", "Sign Up was successful.");
        res.redirect('/');
      })
    }
  );
});

router.get('/login', (req, res, next)=>{
  res.locals.unsuccessful = req.flash('error');
  res.locals.logoutSucess = req.flash('logoutSuccessful');
  res.render('passport/login');
});

router.post('/login-process',
  passport.authenticate('local',{
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/logout', (req, res, next)=>{
  req.logout();
  req.flash('logoutSuccessful', "You logged out successfully.");
  res.redirect('/login');
});


module.exports = router;
