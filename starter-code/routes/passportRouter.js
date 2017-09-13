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

router.get('/signup', (req,res,next) => {
  res.render('passport/signup.ejs');
})
router.get('/private', (req,res,next) => {
  res.locals.user = req.user;
  res.render('passport/private.ejs');
})

router.post('/signup', (req,res,next) => {
  const theUser = new User({
    username: req.body.username,
    password: req.body.loginPassword
  })
  theUser.save((err)=>{
    if(err){
      next(err);
      return;
    }
    res.redirect('/');
  }
)
}
)

router.get('/login', (req,res,next) => {
  res.render('passport/login.ejs');
});

router.post('/process-login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)




module.exports = router;
