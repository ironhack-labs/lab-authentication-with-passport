const express = require('express');
const router = express.Router();

// Require user model

const User = require('./../models/User.model.js')

// Add bcrypt to encrypt passwords

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport ------------


const passport = require('passport')
const ensureLogin = require('connect-ensure-login');

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('hola kike ;D')
  res.render('auth/private', { user: req.user });
});
//---------------------------------------

//SIGNUP


router.get("/signup", (req, res) => res.render("auth/signup"))
router.post("/signup", (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMessage: "Por favor, no dejes campos vacíos!" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if ( user) {
                res.render("auth/signup", { errorMessage: "Usuario ya existente" });
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            return User.create({ username, password: hashPass })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log("Error:", err))
        .catch(err => console.log("Error:", err))
})

//LOGIN



router.get("/login", (req, res) => {
  res.render("auth/login");
});



router.post('/login', passport.authenticate('local', {

  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true

}))



router.get('/logout', (req, res) => {
  req.logout()
  res.redirect("/login")
})



module.exports = router;
