const express = require('express');
const router = express.Router();
// Require user model
const User = require("../models/User.model")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
//Add controllers
const {
  signupView,
  signupProcess,
  loginView,
  loginProcess,
  privatePage,
  logout,

} = require("../controllers/auth")
const { isAuth, isNotAuth, checkRoles } = require("../middlewares")

// Add passport
const passport = require("../config/passport")
//Ensure login is to make sure that the user is logged in before viewing this page.
const ensureLogin = require('connect-ensure-login');
router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

//====================Auth==================== //Validates sif user is authenticated
router.get("/signup", isNotAuth, signupView)
router.post("/signup", isNotAuth, signupProcess)
router.get("/login", isNotAuth, loginView)

// Pasamos el middleware que restringe el acceso a esta ruta al post para que no nos envien informacion desde herramientas de terceros (POSTMAN)
router.post("/login", isNotAuth, loginProcess)

//router.get("/private-page", isAuth, privatePage)

//Logouts user
router.get("/logout", logout)
module.exports = router

module.exports = router;
