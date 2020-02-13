const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: {
    type: String,
    required: [true, 'Password is required.']
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;