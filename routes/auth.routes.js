const express = require("express");
const router = express.Router();
const passport = require("passport");

// Require user model
const User = require("./../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport

const ensureLogin = require("connect-ensure-login");

//GET SingUp
router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.post("/signup", (req, res) => {
    const {
        username,
        password
    } = req.body;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    //console.log('---------------', username, hashPass)

    User.create({
            username,
            password: hashPass,
        })
        .then((theUserCreated) => {
            console.log("Se ha creado el usuario registrado", theUserCreated);
            res.redirect("/signup");
        })
        .catch((err) => console.log("Error", err));
});

//GET Login
router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/lolo",
    failureRedirect: "/loto",
    // failureFlash: true,
    // passReqToCallback: true
}))

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", {
        user: req.user,
    });
});

module.exports = router;