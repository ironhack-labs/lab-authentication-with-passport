const bcrypt       = require('bcrypt');
const passport     = require('passport');
const LocalStrategy= require('passport-local').Strategy;
const User         = require('../models/user');

passport.serializeUser((user,callback)=>{
    callback(null,user.id)
});
passport.deserializeUser((id,callback)=>{
    User.findById(id)
        .then(user => {
            callback(null,user);
        })
        .catch(e=> {
            callback(e);
        });
})
passport.use(
    new LocalStrategy((username,password,callback)=> {
        User.findOne({username})
            .then(user=>{
                if(!user) {
                    return callback(null,false,{message:'Incorrect username!'})
                }
                if(!bcrypt.compareSync(password,user.password)) {
                    return callback(null,false,{message:'Incorrect password!'})
                }
                callback(null,user);
            })
            .catch(e=>callback(e));
    })
)


module.exports = passport;
