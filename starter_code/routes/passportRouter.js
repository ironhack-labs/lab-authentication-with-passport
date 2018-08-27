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

router.get("/signup",(res,req,next)=>{
  res.render("passport/signup")
})

router.post('/sign-up', (req, res, next) => {
  const { email, password } = req.body
  const encrypted = bcrypt.hashSync(password, 10)
  new User({ email, password: encrypted })
      .save()
      .then(result => {
          res.send('User account was created')
      })
      .catch(err => {
          if (err.code === 11000) {
              return res.render('sign-up', { error: 'user exists already' })
          }
          console.error(err)
          res.send('something went wrong')
      })
})


module.exports = router;