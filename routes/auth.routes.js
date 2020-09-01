const express = require('express');
const router = express.Router();

const {
    signupView,
    signupProcess,
    loginView,
    loginProcess,
    private
} = require("../controllers/auth")

const { ensureLogin } = require("../middlewares")

// Require user model
const User = require("../models/User.model")

// Add bcrypt to encrypt passwords


// Add passport

//const ensureLogin = require('connect-ensure-login');

// router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//     res.render('passport/private', { user: req.user });
// });

router.get("/signup", signupView)
router.post("/signup", signupProcess)

router.get("/login", loginView)
router.post("/login", loginProcess)

router.get("/private", ensureLogin("/"), private)



module.exports = router;