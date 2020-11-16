const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10



//Sign up GET
router.get("/signup", (req, res) => res.render("auth/signup"))


// Sign up POST
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/signup", { errorMsg: "Fill all the fields" })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "User already exists" })
                return
            }

            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "Error" }))
        })
        .catch(error => next(error))
})



// Log in GET
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

// Log in POST
router.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))





module.exports = router