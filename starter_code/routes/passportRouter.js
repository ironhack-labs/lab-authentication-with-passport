const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");

const passport      = require("passport");

//render signup view
router.get("/signup",(req,res,next)=>{
  res.render("passport/signup")
})

//hash and send new user to database
router.post("/signup",(req,res,next)=>{
  if(req.body.password1 !== req.body.password2){
    return res.redirect("passport/signup");
  }

  //hash password
  const salt = bcrypt.genSaltSync(bcryptSalt);
    req.body.password = bcrypt.hashSync(req.body.password1,salt);

    User.create(req.body)
    .then(()=> res.redirect("/login"))
  })



router.get("/login",(req,res,next)=>{
  res.render("passport/login")
})

// //logout from session
// router.get("/logout",(req,res,next)=>{
//   req.session.destroy((err)=>{
//     res.redirect("/login");
//   });
// });

    router.post("/login",(req,res,next)=>{
      User.findOne({username:req.body.username})
      .then(user=>{
        if (bcrypt.compareSync(req.body.password , user.password)){
          return res.render("passport/private", {user})
        }res.send("wrong password")
      })
    });

  router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("passport/private", { user: req.user });
  });

module.exports=router;