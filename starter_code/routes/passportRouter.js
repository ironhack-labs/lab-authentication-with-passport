const express        = require('express');
const router         = express.Router();
// User model
const User           = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require('bcrypt');
const bcryptSalt     = 10;
const ensureLogin    = require('connect-ensure-login');
const passport       = require('passport');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
	res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body;
	
	if (username === '' || password === '') {
		res.render('passport/signup', { message: 'Indicate a username and a password to sign up' });
		return;
	}

	User.findOne({ username })
		.then(user => {
			if (user !== null) {
				res.render('passport/signup', {	message: 'The username already exists'	});
				return;
			}

			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);
		
			const newUser = User({
				username,
				password: hashPass
			});

			newUser.save()
				.then(user => {
					res.redirect('/');
				})
				.catch(err => {
					next(err)
				})
		})
		.catch(err => {
			next(err)
		})
});

router.get('/login', (req, res, next) => {
	res.render('passport/login', { 'message': req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/private-page',
	failureRedirect: '/login',
	failureFlash: true,
	passReqToCallback: true
}));

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

module.exports = router;
