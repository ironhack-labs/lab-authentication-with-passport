const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/login', (req, res, next) => res.render('auth/login'));

router.get('/private', (req, res, next) => res.render('auth/private'));

module.exports = router;
