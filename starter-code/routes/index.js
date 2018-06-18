const express = require('express');
const router  = express.Router();

/* GET home page */
// router.get('/', (req, res, next) => {
//   console.log(req);
//   res.render('index');
// });

router.get('/', (req,res,next) => {
  if (req.user) {
    res.render( 'index', {
      username: req.user.username
    } );
  } else {
    res.render( 'index' );
  }
})

module.exports = router;
