const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
    if (req.user) return res.render('index', { layout: 'auth/layout' });
    res.render('index');
});

module.exports = router;
