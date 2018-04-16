const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user:req.user});
});

// router.get("/protected", (req, res) => {
//   if(req.user){
//    res.render("passport/private",{user:req.user});
//   }else{
//     res.redirect("/")
//   }
// });


module.exports = router;
