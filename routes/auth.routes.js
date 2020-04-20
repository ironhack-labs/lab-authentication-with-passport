const express = require('express');
const router = express.Router();
const User = require("../models/User.model")


const bcrypt = require("bcrypt")
const bcryptSalt = 10

const passport = require("passport")

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
	res.render('passport/private', { user: req.user });
});

// Signup
router.get("/signup", (req, res, next) => res.render("auth/signup"))

router.post("/signup", (req, res, next) => {

	const { username, password } = req.body

	if (!username || !password) {
		res.render('auth/signup', { errorMessage: "Rellena el usuario y la contraseña" })
		return
	}

	User.findOne({ username })
		.then(foundUser => {
			if (foundUser) {
				res.render('auth/signup', { errorMessage: "Este usuario ya existe" })
				return
			}
			const salt = bcrypt.genSaltSync(bcryptSalt)
			const hashPass = bcrypt.hashSync(password, salt)

			User.create({ username, password: hashPass })
				.then(() => res.redirect('/'))
				.catch(() => res.render('auth/signup', { errorMessage: "No se pudo crear el usuario" }))
		})
		.catch(error => next(error))


})


// Login
router.get('/login', (req, res) => res.render('auth/login', {errorMessage: req.flash("error")}))

router.post('/login', passport.authenticate("local", {
    successRedirect: '/private',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Rellena todos los campos'

}))



module.exports = router;
