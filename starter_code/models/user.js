const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new require('mongoose').Schema({
    username: String,
    email: String
},{
    timestamps:{
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})

module.exports = require('mongoose').model('User', userSchema);