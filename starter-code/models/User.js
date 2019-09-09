const { Schema, model } = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    username: String,

    email: String
  },
  {
    timestamps: true,
    versionKey: false
  }
);
userSchema.plugin(PLM, { usernameField: 'username' });

module.exports = model('User', userSchema);
