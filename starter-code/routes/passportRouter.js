const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const flash = require("connect-flash");

router.get('/signup',(req,res,next)=>{
  res.render("passport/signup");
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  
  User.findOne({ username: username }, 'username', (err, user) =>{

    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
    })

    newUser.save((err) => {
      if (err) { return next(err) }
      res.redirect('/');
    })
  })
});

router.get('/login', (req, res, next) => {
  res.render('passport/login',{ "message": req.flash("error") });
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true, //disable/enable flash messaging but need flash package
  passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
    // req.session.destroy((err)=>{
    req.logout();
    res.redirect('/login');
    // });
});

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
