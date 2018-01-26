const express = require('express');
const router = express.Router();
const authController = require('../controllers/passport.controller');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

router.get('/signup', authController.signup);
router.post('/signup', authController.doSignup);

router.get('/login', authController.login);
router.post('/login', authController.doLogin);

router.get('/private', ensureLogin.ensureLoggedIn('/passport/login'), authController.private);
router.post('/auth/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email']}));
router.get('/auth/:provider/cb', authController.loginWithProviderCallback)

router.get('/logout', authController.logout);

module.exports = router;