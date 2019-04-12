const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10;
const FIRST_ADMIN_USERNAME = process.env.FIRST_ADMIN_USERNAME || 'admin';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  }, 
  role: {
    type: String,
    enum: ["admin", "guest"],
    default: "guest"
  }
}, {  timestamps: true });

userSchema.pre('save', function(next) {
  const user = this;

  if (user.username === FIRST_ADMIN_USERNAME) {
    user.role = 'admin';
  }

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;