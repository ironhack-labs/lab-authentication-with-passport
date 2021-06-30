const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res, next) => {
	res.render('auth/signup');
});

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.post('/signup', (req, res, next) => {
	console.log(req.body);
	const { username, password } = req.body;
	// validation
	// is the password 8 + characters - 
	if (password.length < 8) {
		// if not we show the signup form again with a message 
		res.render('signup', { message: 'Your password has to be 8 chars min', title: 'Sign up' });
		return;
	}
	// check if the username is empty
	if (username.length === 0) {
		// if yes show the form again with a message
		res.render('signup', { message: 'Your username cannot be empty', title: 'Sign up' });
		return;
	}
	// validation passed - username and password are in the correct format
	// we now check if that username already exists
	User.findOne({ username: username })
		.then(userFromDB => {
			// if user exists
			if (userFromDB !== null) {
				// we render signup again	
				res.render('signup', { message: 'This username is already taken', title: 'Sign up' });
				return;
			} else {
				// if we reach this point this username can be used 
				// we hash the password and create the user in the database
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt);
				console.log(hash);
				User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log(createdUser);
						res.redirect('/login');
					})
					.catch(err => {
						next(err);
					})
			}
		})
});

module.exports = router;
