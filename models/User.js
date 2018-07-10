const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new require('mongoose').Schema({
    username: String,
    email: String
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})
module.exports = require('mongoose').model('User', userSchema);