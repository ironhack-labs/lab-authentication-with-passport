const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


router.get("/private", (req,res, next)=>{
  res.render("passport/private.ejs");
})


router.get("/signup", (req,res, next)=>{
  res.render("passport/signup.ejs");
})

router.post("/signup", (req,res,next)=>{
  const username = req.body.username,
        password = req.body.password;


  const hashPass = bcrypt.hashSync(password, bcryptSalt);

  const newUser = new User({
    username,
    password:hashPass
  });

  newUser.save(err=>{
      if (err) return res.render("/signup", { message: "Something went wrong" });
      res.redirect("/login");
  });

});

router.get("/login", (req,res, next)=>{
  res.render("passport/login.ejs");
})

router.post("/login", (req,res,next)=>{
  
  const username = req.body.username,
  password = req.body.password;
   
  newUser.findOne({username}, "username", (err, user)=>{
    if (user){
        res.redirect("/private")
        return;
    }
    // else{
    //   res.redirect(l)
    // }

});
})






module.exports = router;
