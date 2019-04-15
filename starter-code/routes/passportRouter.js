const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require ('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup", { user: req.user });
});

passportRouter.post("/signup", (req, res, next) => {
  
  let {username, password} = req.body;

	if (username === "" || password === "") {
		res.render("passport/signup", {
      message: "Indicate username and password"
		});
		return;
	}

	User.findOne({
			username
		})
		.then(user => {
			if (user !== null) {
				res.render("passport/signup", {
					message: "The username already exists"
				});
				return;
			}

			const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

			const newUser = new User({
				username,
				password: hashPass
			});

			newUser.save((err) => {
				if (err) {
					res.render("passport/signup", {
            message: "Something went wrong"
					});
				} else {
					res.redirect("/");
				}
			});
		})
		.catch(error => {
			next(error)
		})
});

module.exports = passportRouter;