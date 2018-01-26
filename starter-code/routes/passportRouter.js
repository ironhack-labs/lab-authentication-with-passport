const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const passportController = require('../controllers/passport.controller');

router.get("/signup", passportController.signup);
router.post("/signup", passportController.doSignup);
router.get("/login", passportController.login);
router.post("/login", passportController.doLogin);
router.get("/private-page", ensureLogin.ensureLoggedIn(), passportController.privatePage);

module.exports = router;