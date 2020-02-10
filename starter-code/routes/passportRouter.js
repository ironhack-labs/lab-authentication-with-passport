const express = require('express');
const passportRouter = express.Router();
const User = require('../models/user');
const { hashPassword } = require('../lib/hashing');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// Signup route
passportRouter.get('/signup', (req, res, next) => {
	res.render('passport/signup', { title: 'Register now!' });
});

passportRouter.post('/signup', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const registeredUser = await User.findOne({ username });

		if (registeredUser) {
			console.log(`User ${registeredUser.username} already exists`);
			req.flash('error', `User ${registeredUser.username} already exists`);
			return res.redirect('/signup');
		} else {
			const newUser = await User.create({ username, password: hashPassword(password) });
			console.log(`New user created: ${newUser}`);
			req.login(newUser, error => {
				res.redirect('/private-page');
			});
		}
	} catch (error) {
		console.log('Credentials are necessary');
		req.flash('error', 'Credentials are necessary');
		res.redirect('/signup');
	}
});

// Login route
passportRouter.get('/login', (req, res, next) => {
	res.render('passport/login', { title: 'Login' });
});

passportRouter.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

// Logout
passportRouter.get('/logout', (req, res, next) => {
	console.log(req.user.username, 'just logged out');
	req.logout();
	res.redirect('/login');
});

// Private route
passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render('passport/private', { user: req.user, title: req.user.username });
});

module.exports = passportRouter;
