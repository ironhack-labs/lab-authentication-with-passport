const express  = require("express");
const router   = express.Router();
const auth     = require('../controllers/auth.controller');
const secure   = require('../middlewares/secure.mid');

// Add bcrypt to encrypt passwords
const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), auth.private);

router.get('/signup', auth.signup);
router.post('/signup', auth.doSignup);

router.get('/login', auth.login);
router.post('/login', auth.doLogin);

module.exports = router;