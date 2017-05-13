const mongoose = require('mongoose');

const User = require('./user-model.js');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  desc: String,
  pic_path: String,
  pic_name: String,
  owner: { type: Schema.Types.ObjectId }
},

{
  timestamps: true
}

);


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
