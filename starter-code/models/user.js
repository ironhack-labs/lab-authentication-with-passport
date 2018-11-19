const mongoose = require('mongoose');

const { Schema }   = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
