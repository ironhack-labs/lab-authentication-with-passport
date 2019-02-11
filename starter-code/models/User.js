const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema);
module.exports = User;