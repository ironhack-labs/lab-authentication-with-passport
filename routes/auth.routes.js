const express = require('express');
const router = express.Router();
const {
    ensureLogin
} = require('../middlewares/index');
const {
    signupView,
    signupProcess,
    loginView,
    loginProcess,
    logout
} = require('../controllers/auth');

router.get('/signup', signupView);
router.post('/signup', signupProcess);
router.get('/login', loginView);
router.post('/login', loginProcess);
router.get('/logout', logout);

router.get('/private-page', ensureLogin('/login'), (req, res) => {
    res.render('auth/private', {
        user: req.user
    });
});

module.exports = router;