const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'username'});
const User = mongoose.model("User", userSchema);
module.exports = User;

