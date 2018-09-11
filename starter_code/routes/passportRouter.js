const express        = require("express");
const router         = express.Router();
// User model
const { User, validateUser } = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");
var flash = require('connect-flash');



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


/* Return Signup page */
router.get('/signup', (req, res, next) => {
    res.status(200)
        .render('passport/signup');
});

/* Create new User */
router.post('/signup', async function(req, res, next)  {

    let { username, password } = req.body;

    let validateRes = validateUser({
        username,
        password
    });

    let message = null;

    if(validateRes) {
        message = validateRes.details[0].message;
        return res.status(400)
            .render('passport/signup', {
                message,
                username,
                password
            });
    }

    let user = await User.findOne({ username });

    if(user) {

       message = "User with this name already exists!";

        return res.status(400)
            .render('passport/signup', {
                message,
                username,
                password
            });

    } else {

        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({ username, password });
            const result = await user.save();

            if(result) {
                res.status(201)
                    .redirect('/');
            }

        } catch(ex) {
            next(ex);
        }

    }

});

/* Return login user page */
router.get('/login', (req, res, next) => {
    res.status(200)
        .render('passport/login', { message: req.flash('error') });
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true

}));

/* Return logout user page */
router.get('/logout', (req, res, next) => {
    req.logout();

    res.status(200)
        .redirect('/');
});

module.exports = router;
