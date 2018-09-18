const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");


//prive
router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//SIGN UP

router.get('/signup', (req, res, next)=>{
  res.render('passport/signup')
})


router.post('/signup', (req, res, next)=>{
    User.register(req.body, req.body.password)
    .then(user=>res.redirect('/login'))
    .catch(error => next(error))
})


//LOG IN --
router.get('/login', (req, res)=>{
  req.error = "ese usuario no existe"
  res.render('passport/login', { user: req.user, error: req.error})
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/private')
})


module.exports = router;