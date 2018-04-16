const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if(req.user){
    let user = req.user;
    res.render("index", {user});
  }else{
    res.render("index");
  }
 
});

module.exports = router;
