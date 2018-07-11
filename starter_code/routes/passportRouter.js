const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const passport      = require("passport");
const signupController = require("../controllers/signup.controller");
const loginController = require("../controllers/login.controller");

router.get('/signup', signupController.create);
router.post('/signup', signupController.doCreate);

router.post('/login', loginController.create);
//router.post('/login', loginController.doCreate);

/* router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
}); */

module.exports = router;