const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  username: { type: String },
  encryptedPassword: { type: String },
  pic_path: String,
  pic_name: String,
  facebookID: String,
  googleID: String
},

{
  timestamps: true
}

);


const User = mongoose.model('User', userSchema);

module.exports = User;
