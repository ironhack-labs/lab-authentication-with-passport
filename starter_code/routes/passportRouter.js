const express        = require("express");
const router         = express.Router();
// User model
const { User, validateUser } = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



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

    let errorMessage = null;

    if(validateRes) {
        errorMessage = validateRes.details[0].message;
        return res.status(400)
            .render('auth/signup', {
                errorMessage,
                username,
                password
            });
    }

    let user = await User.findOne({ username });

    if(user) {

        errorMessage = "User with this name already exists!"

        return res.status(400)
            .render('auth/signup', {
                errorMessage,
                username,
                password
            });

    } else {

        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({ username, password });
            const result = await user.save();

            res.status(201)
                .redirect('/');
        } catch(ex) {
            next(ex);
        }

    }

});

module.exports = router;
