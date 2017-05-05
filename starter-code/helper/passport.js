const bcrypt = require("bcrypt");
const passport = require ("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const fbStrategy= require("passport-facebook").Strategy;


// passport.serializeUser((user,cb)=>{
//   cb(null, user);
// });
//
// passport.deserializeUser((id, cb)=>{
//   User.findOne({"_id": user._id},(err, user)=>{
//     if (err) return cb(err);
//     cb(null, user);
//   });
// });



passport.use(new LocalStrategy((username, password, next)=>{
  User.findOne({username}, (err, user)=>{
    if(err) return next(err);
    if(!user) return next(null, false, {message:"Incorrect user"});
    if(!bcrypt.compareSync(password, user.password)) return next(null, false, {message:"Incorrect password"});
    return next(null, user);
  });
}));

passport.use(new fbStrategy({
clientID: "1840533306269630",
 clientSecret: "435da2c16ede11b93368477f19cd2440",
 callbackURL: "http://localhost:3000/auth/facebook/call"},
 (accessToken, refreshToken, profile, done) => {
done(null, profile);
}))
passport.serializeUser((user,cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

module.exports= passport;
