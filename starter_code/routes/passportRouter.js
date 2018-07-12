const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {user: req.user});
});

router.get("/signup", (req, res, next) => {
    res.render("views/passport/signup.hbs")
})

router.post("/signup", (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;
    if (password === "" || username === "") {
        res.render('views/passport/signup', {errorMessage: 'Please fill in both a username and password to create an account'})
        return;
    }
    User.findOne({'username': username})
        .then((responseFromDB) => {
            if (responseFromDB !== null) {
                res.render('views/passport/signup', {errorMessage: `Sorry, the username "${username}" is taken`})
                return;
            } // ends the if statement
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            User.create({username: username, password: hashedPassword})
                .then((response) => {
                    res.redirect('/');
                })
                .catch((err) => {
                    next(err);
                })
        }) // ends the .then from the user.findOne
});

router.get('/login', (req,res,next)=>{
    res.render("views/passport/login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",//sends to if it worked out
    failureRedirect: "/login",//sends to if it didnt work out
    failureFlash: true,
    passReqToCallback: true
}));