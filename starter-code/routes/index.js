const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/*Get login*/
router.get('/pass')








module.exports = router;
