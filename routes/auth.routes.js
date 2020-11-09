const express = require('express');
const router = express.Router();
// Require user model
const User= require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt= require('bcrypt')
const bcryptSalt=12;
// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});


router.get('')
module.exports = router;
