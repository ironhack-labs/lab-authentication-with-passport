const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String,required:true},
  password: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

const bcrypt=require('bcrypt');

userSchema.methods.validPassword=(password)=>{
  return bcrypt.compareSync(this.password,password);
};

module.exports = User;