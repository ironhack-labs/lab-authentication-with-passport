const express = require('express');
const passportRouter = express.Router();
const User = require('../models/user');
const { hashPassword } = require('../lib/hashing');
const passport = require('passport');

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
			return res.redirect('/signup');
		} else {
			const newUser = await User.create({ username, password: hashPassword(password) });
			console.log(`New user created: ${newUser}`);
			res.redirect('/');
		}
	} catch (error) {
		console.log('Credentials are necessary');
		res.redirect('/signup');
	}
});

// Login route
passportRouter.get('/login', (req, res, next) => {
	res.render('passport/login');
});

passportRouter.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

// Add passport
const ensureLogin = require('connect-ensure-login');

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render('passport/private', { user: req.user });
});

module.exports = passportRouter;
