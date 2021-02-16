const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const bcrypt = require('bcrypt');

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new Schema({
  username: String,
  password: {
    type: String,
    type: String,
    match: [PASSWORD_PATTERN, 'Please, enter a valid password.']
  },
  googleID: String
}, {
  timestamps: true
});

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
}

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hash => {
        this.password = hash;
        next();
      })
  } else {
    next();
  }
})

const User = mongoose.model("User", userSchema);
module.exports = User;