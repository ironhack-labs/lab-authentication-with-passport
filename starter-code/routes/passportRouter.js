const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");

const authController = require('../controllers/auth.controller');
const passport      = require("passport");

router.get('/signup', authController.signup); // ruta /signup o /passport/signup?
router.post('/signup', authController.doSignup);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});






module.exports = router;
