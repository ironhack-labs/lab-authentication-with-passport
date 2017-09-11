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
  res.render('passport/signup', { errorMessage: "" })

})

router.post('/signup', (req, res, next) => {
  let userName = req.body.username;
  let password = req.body.password;

  User.findOne({ username: userName }, (err, user) => {
    if(err) {return next(err)}
    if(user !== null) {
      res.render('passport/signup', {
        errorMessage: "This user already exists"
      })
      return;
    }
    if(userName === "" || password === "") {
      res.render('passport/signup', {
        errorMessage: "Write a password or username"
      })
      return;
    }
    let salt = bcrypt.genSaltSync(bcryptSalt);  //esto es el bycriptSalt?
    let hashPass = bcrypt.hashSync(password, salt); //esto lo aplica al pass?

    const newUser = User({
      username: userName,
      password: hashPass
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(err => res.render("passport/signup", { errorMessage: "Something went wrong"}))

  })
})

router.get('/login', (req, res, next) => {
  res.render('passport/login', {message: req.flash("error")});
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private', { user: req.user } )
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


module.exports = router;
