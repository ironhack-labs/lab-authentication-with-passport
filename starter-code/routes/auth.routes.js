const express  = require("express");
const router   = express.Router();
const auth     = require('../controllers/auth.controller');
const secure   = require('../middlewares/secure.mid');
const passport = require('passport');

// Add bcrypt to encrypt passwords

router.get('/private-page', auth.private);

router.get('/signup', auth.signup);
router.post('/signup', auth.doSignup);

//router.get('/login', auth.login);

module.exports = router;