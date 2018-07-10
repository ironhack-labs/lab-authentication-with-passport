const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})
module.exports = require('mongoose').model('User', userSchema);
