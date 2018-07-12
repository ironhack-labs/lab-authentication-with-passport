const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    bcrypt.genSalt(saltRounds)
      .then(salt => {
       return  bcrypt.hash(this.password, salt)
      })
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(error => next(error));
  } else {
    next();
  }
})

const User = mongoose.model("User", userSchema);
module.exports = User;