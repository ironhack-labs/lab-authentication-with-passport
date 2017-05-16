const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

  // console.log('HOME PAGE ************************************');

  // console.log('SESSION (from express-session middleware)*****');
  // console.log(req.session);

  // console.log('\n');
  // console.log('USER (from Passport middleware)***************');
  // console.log(req.user);

  res.render('index',
    { successMessage: req.flash('success') }
  );
});

module.exports = router;
