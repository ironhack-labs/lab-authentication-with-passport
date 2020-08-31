const express = require('express');

const router = express.Router();

const ensureLogin = require('connect-ensure-login');

const {
    signupProcess,
    signupView,
    loginView,
    loginProcess,
    private
  } = require("../controllers/auth")


// Require user model
// const User = require("../models/User.model")

// Add bcrypt to encrypt passwords


// Add passport

router.get("/signup", signupView)
router.post("/signup", signupProcess)
router.get("/login", loginView)
router.post("/login", loginProcess)
router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('auth/private', { user: req.user })
  });
    
// router.get("/private", ensureLogin("/"), private)


// router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//  res.render('passport/private', { user: req.user });
// });

module.exports = router;
