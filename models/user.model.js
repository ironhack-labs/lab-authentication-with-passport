const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSch = new Schema({
    username: String,
    password: String,
}, { timestamps: true })

const User = mongoose.model('User', userSch)

module.exports = User