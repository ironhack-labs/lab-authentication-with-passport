const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('HOME ----------------');
  console.log('SESSION (from express-session)', req.session);
  console.log('USER (from passport)', req.user);




  res.render('index', {
    successMessage: req.flash('success'),
  });
});

module.exports = router;
