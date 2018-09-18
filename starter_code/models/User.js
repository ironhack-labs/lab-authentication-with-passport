const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PLM = require('passport-local-mongoose')

const userSchema = new Schema ({
  username:String,
  email: String,
  password:String,

  photoURL: String
},{
  createdAt : 'created_At',
  updatedAt: 'updated_at'
})

userSchema.plugin(PLM, {usernameField: 'email'})

module.exports = mongoose.model ('User', userSchema)