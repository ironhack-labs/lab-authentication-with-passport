const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");

const passportController = require("../controllers/passportController");
const authMiddleware = require("../middlewares/auth.middlewares");


router.get("/private-page", 
ensureLogin.ensureLoggedIn(), 
(req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", passportController.signupCreate);
router.post("/signup", passportController.signupDoCreate);

router.get("/login", passportController.loginCreate);
router.post("/login", passportController.loginDoCreate);

router.get("/private-page", authMiddleware.isAuthenticated, passportController.privateCreate);

module.exports = router;
