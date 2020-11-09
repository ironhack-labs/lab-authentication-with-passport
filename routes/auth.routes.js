const express = require('express');
const router = express.Router();
const { signupGET, signupPOST, loginGET, loginPOST, privateGET } = require('../controllers/User.controllers');
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');
const { registerHelper } = require('hbs');
const { isNotAuth, isAuth } = require('../middlewares');


router.get('/signup', isNotAuth, signupGET);
router.post('/signup', isNotAuth, signupPOST);
router.get('/login', isNotAuth, loginGET);
router.post('/login', isNotAuth, loginPOST);
router.get('/private-page', isAuth, privateGET);
router.get('/logout', isAuth, (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
