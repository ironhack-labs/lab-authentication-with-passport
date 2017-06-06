const mongoose = require('mongoose');

const User = require('./user-model.js');

const Schema = mongoose.Schema;

const replySchema = new Schema({
  content: String,
  authorId: String,
  upvotes: { type: Number,
    default: 0
  },
  upvotesId: [{ type: String }]

  // BY REFERENCE INSTEAD OF SUBDOCUMENTS
  // product: { type: Schema.Types.ObjectId }
});

const Reply = mongoose.model('Reply', replySchema);


module.exports = Reply;
