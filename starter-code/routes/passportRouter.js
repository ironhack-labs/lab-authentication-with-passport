const express        = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup",(req,res,next)=>{
  res.render('passport/signup')
});

passportRouter.get("/login",(req,res,next)=>{
  res.render('passport/login')
});

passportRouter.post("/new-user", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	if (username === "" || password === "") {
		res.render("/signup", {
			"message": "Indicate username and password",
			"section": "signup"
		});
		return;
	}
	User.findOne({
		username
	})
		.then(user => {
			if (user !== null) {
				res.render("/signup", {
					"message": "The username already exists",
					"section": "signup"
				});
				return;
			}
			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);
			const newUser = new User({
				username,
				password: hashPass
			});
			newUser.save((err) => {
				if (err) {
					res.render("/signup", {
						message: "Something went wrong",
						"section": "signup"
					});
				} else {
					res.redirect("/login");
				}
			});
		})
		.catch(error => {
			next(error)
		})
});


passportRouter.post("/login-user", passport.authenticate("local", {
  successReturnToOrRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


// passportRouter.post("/login-user", (req, res, next) => {

//   const theUsername = req.body.username;
//   const thePassword = req.body.password;
 
//   if (theUsername === "" || thePassword === "") {
//     res.render("passport/login", {
//       errorMessage: "Please enter both, username and password to sign up."
//     });
//     return;
//   }
 
//   User.findOne({ "username": theUsername })
//     .then(user => {
//       if (!user) {
//         res.render("passport/login", {
//           errorMessage: "The username doesn't exist."
//         });
//         return;
//       }
//       if (thePassword === user.password) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/private");
//       } else {
//         res.render("passport/login", {
//           errorMessage: "Incorrect password"
//         });
//       }
//     })
//     .catch(error => {
//       next(error);
//     })
//  });


module.exports = passportRouter;