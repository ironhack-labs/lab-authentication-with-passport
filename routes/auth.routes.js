const express = require('express');
const router = express.Router();
// Require user model

// Add bcrypt to encrypt passwords

// Add passport
const {
    signupView,
    loginView,
    signupMethod,
    loginMethod,
    privateView,
    logoutView
} = require("../controllers/auth")

// const ensureLogin = require('connect-ensure-login');

const { isAuth, isNotAuth } = require('../middlewares')

router.get("/signup", signupView)
router.post("/signup", signupMethod)
router.get("/login", loginView)
router.post("/login", loginMethod)
router.get('/private-page', isAuth, privateView)
router.get('/logout', logoutView)

module.exports = router;