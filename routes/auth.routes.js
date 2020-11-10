const express = require('express');
const router = express.Router();
// Require user model
const User = require("../models/User.model.js")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
// Add passport
const passport = require("../config/passport")
const { isAuth, isNotAuth, checkRoles } = require("/middlewares/middleware")



//check Login
const ensureLogin = require('connect-ensure-login');
const { response, Router } = require('express');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

//middleware Routes

router.post("/login", isNotAuth, loginProcess)
router.get("/private", isAuth, privatePage)


module.exports = router;
