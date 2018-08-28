const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');

router.use(ensureLogin.ensureLoggedIn('/login'));

router.get('/private', (req, res, next) => {
    console.log(req.user);
    res.render('passport/private', { user: req.user });
});

module.exports = router;
