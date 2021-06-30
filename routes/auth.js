const router = require("express").Router();
const User = require('../models/User');
// const bcrypt = require('bcrypt');
const passport = require('passport');

// router.get('/login', (req, res, next) => {
// 	res.render('login');
// });

router.get('/login', passport.authenticate('github'));

// this the route that we registered on the github api when we created the app
router.get('/auth/github/callback',
	passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

// router.post('/login', passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/login',
// 	passReqToCallback: true
// }));

router.get('/logout', (req, res, next) => {
	console.log('user BEFORE log out: ' + req.user)
	req.logout();
	console.log('user AFTER log out: ' + req.user)
	res.redirect('/');
});

const ensureLogin = require('connect-ensure-login');

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
	console.log('user arriving at the private page: ' + req.user.username)
	res.render('auth/private', { user: req.user, title: 'Private page for ' + req.user.username });
});

module.exports = router;