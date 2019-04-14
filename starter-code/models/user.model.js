const mongoose = require("mongoose");
const bcrypt   = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  username: {
    type:      String,
    required:  [true, 'UserName is required'],
    minlength: [8, 'UserName needs at least 8 chars'],
    trim: true
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: [8, 'Password needs at least 8 chars']
  }
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
  const user = this;

  if ( user.isModified('password') ) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then( salt => bcrypt.hash(user.password, salt)
        .then( hash => {
          user.password = hash;
          next();
        }) )
      .catch( error => next(error) );
  }
  else { next(); }
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;