const express = require('express');
const router = express.Router();
const passport = require('passport')
// Require user model
const User = require("../models/user.model");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
router.get("/signup", (req,res) => res.render("auth/signup"))
router.post("/signup", (req,res) => {
  const{username,password} = req.body
  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { errorMsg: "Rellena los campos, ¡vago!" });
    return
}

User
    .findOne({ username })
    .then(user => {
        if (user) {
            res.render("auth/signup", { errorMsg: "Usuario ya existente" });
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        return User.create({ username, password: hashPass })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log("Error!:", err))

})


// Login
router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});


module.exports = router;
