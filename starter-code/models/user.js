const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.pre('save', function(next) {
  const user = this;

  if(!user.isModified('password')) {
      next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
          bcrypt.hash(user.password, salt)
              .then(hash => {
                  user.password = hash;
                  next();
              })
      })
      .catch(error => {
          next(error);
      })
})

const User = mongoose.model("User", userSchema);
module.exports = User;
