const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String },
  username: { type: String },
  encryptedPassword: { type: String },
  role: {
      type: String,
      enum: [ 'normal user', 'admin' ],
      default: 'normal user'
    },
  pic_path: { type: String, default: "/img/profile-blank.png"},
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
