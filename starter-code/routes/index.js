const express = require('express');
const router = express.Router();

// use routes
const passportRouter = require('./passportRouter');
router.use('/', passportRouter);

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

module.exports = router;
