const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "username", 
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);

