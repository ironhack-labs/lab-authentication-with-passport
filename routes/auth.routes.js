const express = require('express');
const router = express.Router();
// Add passport
// const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const {
    signupView
} = require('../controllers/auth');

router.get('/signup', signupView);

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('passport/private', {
        user: req.user
    });
});

module.exports = router;