const mongoose = require('mongoose');

const User = require('./user-model.js');

const Review = require('./review-model.js');
const Forum = require('./forum-model.js');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  name: String,
  desc: String,
  pic_path: String,
  pic_name: String,
  reviews: [ Review.schema ],
  upvotes: {
    type: Number,
    default: 0,
  },
  upvotesId: [{
    type: String
}],
  forums: [ Forum.schema ],
  owner: String
},

{
  timestamps: true
}

);


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
