const mongoose = require('mongoose');
const Reply = require('./reply-model');

const User = require('./user-model.js');

const Schema = mongoose.Schema;

const forumSchema = new Schema({
  content: {
    type: String
  },
  replies: [ Reply.schema ],
  author: [ User.schema ],
  authorName: String,
  authorPic: String,
  authorF: String,
  gameId: String,

  // BY REFERENCE INSTEAD OF SUBDOCUMENTS
  // product: { type: Schema.Types.ObjectId }
});

const Forum = mongoose.model('Forum', forumSchema);


module.exports = Forum;
