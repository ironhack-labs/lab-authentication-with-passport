const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User')
// Add passport 
const passport = require('../config/passport')
const ensureLogin = require("connect-ensure-login");


passportRouter.get('/signup', (req,res,next) => {
	const config = {
		title: 'Sign up',
		action: '/signup',
		button: 'Sign up',
		register: true
	}
	res.render('passport/form', config) //info dinámica en auth/form
})

passportRouter.post('/signup', async (req,res, next) => {
	try {
		const user = await User.register({ ...req.body }, req.body.password) //thnks to PLM
		console.log(user)
		res.redirect('/login')
	} catch (err) {
		console.log(err)
		res.send('El usuario ya existe')
	}
})


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/login', (req,res, next) => {
	const config = {
		title: 'Log in',
		action: 'Log in',
		button: 'Log in'
	}
	res.render('passport/form', config)
})

passportRouter.post('/login', passport.authenticate('local'), (req,res, next) => {
	res.redirect('/private')
})

passportRouter.get('/private',isLoggedIn, (req, res, next) => {
  res.render('passport/private', { user: req.user });
})

passportRouter.get('/logout', (req, res, next) => {
	req.logOut()
	res.redirect('/login')
})

function isLoggedIn (req, res, next) {
	if(req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/login')
	}
}

module.exports = passportRouter;