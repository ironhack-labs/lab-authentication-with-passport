const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const PLM      = require('passport-local-mongoose')

const userSchema = new Schema({
  username: String
}, {
  timestamps: true
});

userSchema.plugin(PLM, { usernameField: 'username' })
module.exports = mongoose.model("User", userSchema);
