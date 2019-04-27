const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password:{
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true})

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
      return bcrypt.hash(user.password, salt)
        .then(hash => {
          user.password = hash;
          next();
        })
    })
    .catch(error =>  next(error))
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;