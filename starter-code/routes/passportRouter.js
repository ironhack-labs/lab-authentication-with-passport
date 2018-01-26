const express        = require("express");
const router         = express.Router();
// User model
const User           = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
const passController = require("../controllers/passport.controller");


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
res.render("passport/private", { user: req.user });
});

router.get('/signup', passportController.signup);
router.post('/signup', passportController.doSignup);

router.get('/login', passportController.login);
router.post('/login', passportController.doLogin);

router.get('/logout', passportController.logout);






module.exports = router;
