const express = require('express');
const router = express.Router();
// const ensureLogin = require('connect-ensure-login');

// Require controllers
const {
  showSignup,
  runSignup,
  showLogin,
  runLogin,
  private
} = require('../controllers/auth')

// Requerir middleware
const {ensureLogin} = require("../middlewares")

// router.get('/private-page', ensureLogin('/private'), (req, res) => {
//   res.render('passport/private', { user: req.user });
// });
// SIGNUP
router.get('/signup', showSignup)
router.post('/signup', runSignup)
// LOGIN
router.get('/login', showLogin)
router.post('/login', runLogin)

router.get('/private', ensureLogin('/login'), private)

module.exports = router;
