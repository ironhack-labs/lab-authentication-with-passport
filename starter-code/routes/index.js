const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user)
  res.render('index');
});

module.exports = router;
