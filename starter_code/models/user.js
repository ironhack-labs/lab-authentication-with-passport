const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  user: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'user'})

module.exports = mongoose.model('User', userSchema)