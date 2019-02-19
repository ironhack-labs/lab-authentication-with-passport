const express        = require('express');
const router         = express.Router();
const ensureLogin    = require('connect-ensure-login')
// Require user model
const User           = require('../models/user');


router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = router;