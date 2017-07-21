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

router.get('/signup', (req, res)=>{
  res.render('passport/signup');
});


router.post('/signup', (req, res)=>{
  let username = req.body.username;
  let password = req.body.password;

  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User (
    {
      username: username,
      password: hashPass

    });
  newUser.save((err) => {
      res.redirect("/login");
    });

});

router.get('/login', (req, res)=>{
  res.render('passport/login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/private-page');
  });





module.exports = router;
