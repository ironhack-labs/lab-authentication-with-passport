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

router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  const encrypted = bcrypt.hashSync(password, 10)

  new User({ username, password: encrypted })
      .save()
      .then(result => {
          res.redirect("/");
      })
      .catch(err => {
          if (err.code === 11000) {
              return res.render('signup', { error: 'user exists already' })
          }
          console.error(err)
          res.send('something went wrong')
      })
})

router.get("/login", (req, res, next) => {
  res.render("passport/login", { error: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
  })
)

module.exports = router