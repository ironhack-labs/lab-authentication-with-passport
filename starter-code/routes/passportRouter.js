const express        = require("express");
const authRouter         = express.Router();
const User           = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");



authRouter.get("/signup",(req,res,next)=>{
  res.render("passport/signup");
})
authRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRouter.get("/login",(req,res,next)=>{
  res.render("passport/login");
})
authRouter.post("/login",passport.authenticate("local",{
  successRedirect: "/private",
  failureRedirect:"/passport/login"

}));

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



authRouter.get('/private',(req, res, next) =>{
  res.render('private');
});





module.exports = authRouter;
