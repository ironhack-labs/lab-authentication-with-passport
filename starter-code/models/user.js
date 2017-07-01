const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'You need a username'],
    unique: [true, 'That name already exists']
  },
  password: String,
  facebookID: String,
  googleID: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
