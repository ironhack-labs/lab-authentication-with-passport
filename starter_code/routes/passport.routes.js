const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user.model");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt-nodejs");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const sessionController = require('../controllers/sessions.controller');

router.get("/signup",sessionController.userCreate);
router.post('/signup',sessionController.userDoCreate);

router.get('/login',sessionController.userCreate);
router.post('/login',sessionController.userDoCreate);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;