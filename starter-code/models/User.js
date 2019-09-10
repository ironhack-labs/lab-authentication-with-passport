const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const PLM = require('passport-local-mongoose');

const userSchema = new Schema({
  username: String
}, {
  timestamps: true,
  versionKey : false
});

userSchema.plugin(PLM, { usernameField: 'username'});
const User = mongoose.model("User", userSchema);
module.exports = User;