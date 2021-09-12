// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

// User model
const User = require('../models/User.model.js');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Add passport
const passport = require('passport');
// Add flash
var flash = require('connect-flash');
const ensureLogin = require('connect-ensure-login');
//-----------------------------------------------------------------------------------------
// PRIVATE GET
router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render('auth/private', { user: req.user });
});
//-----------------------------------------------------------------------------------------
// SIGNUP GET
router.get('/signup', (req, res, next) => res.render('auth/signup'));
// SIGNUP POST
router.post('/signup', (req, res, next) => {
	const { username, passwordHash } = req.body;

	// 1. Check username and password are not empty
	if (!username || !passwordHash) {
		res.render('auth/signup', { errorMessage: 'Indicate username and password' });
		return;
	}

	User.findOne({ username })
		.then((user) => {
			// 2. Check user does not already exist
			if (user !== null) {
				res.render('auth/signup', { message: 'The username already exists' });
				return;
			}

			// Encrypt the password
			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(passwordHash, salt);

			//
			// Save the user in DB
			//

			const newUser = new User({
				username,
				passwordHash: hashPass
			});

			newUser.save().then(() => res.redirect('/')).catch((err) => next(err));
		})
		.catch((err) => next(err));
});
//-----------------------------------------------------------------------------------------
//https://www.passportjs.org/docs/downloads/html/
//https://github.com/jaredhanson/connect-flash
// LOGIN GET
router.get('/login', (req, res) => res.render('auth/login', { errorMessage: req.flash('error') }));

//LOGIN POST
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/private',
		failureRedirect: '/login',
		failureFlash: true,
		passReqToCallback: true
	})
);
//-----------------------------------------------------------------------------------------
// LOG FUCKING OUT OF THIS LAB
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});
//-----------------------------------------------------------------------------------------
module.exports = router;
