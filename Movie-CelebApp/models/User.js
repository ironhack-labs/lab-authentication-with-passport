const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  profilePic: String, 
  firstName: String,
  lastName: String,
  bio: String,
  admin: Boolean
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;