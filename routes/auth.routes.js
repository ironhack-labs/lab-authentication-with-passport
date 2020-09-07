const express = require('express');
const router = express.Router();
const { ensureLogin } = require('../middlewares/index');
const { loginAuth, loginView, signupAuth, signupView, logout, private } = require('../controllers/auth');

// ITERATION #1
router.get('/signup', signupView);
router.post('/signup', signupAuth);

// ITERATION #2
router.get('/login', loginView);
router.post('/login', loginAuth);

router.get("/logout", logout);

router.get('/private', ensureLogin('/login'), private);

module.exports = router;