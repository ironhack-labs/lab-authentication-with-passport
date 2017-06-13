const mongoose = require('mongoose');

const User = require('./user-model.js');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: {
    type: String,
    required: [true, 'Please tell us about your review.'],
  },
  stars: {
    type: Number,
    required: [true, 'Rate the product.'],
    min: [1, 'Ratings can be no lower than 1 star.'],
    max: [5, 'Ratings can be no better than 5 stars.']
  },
  authorId: String,
   author: [ User.schema ],
   authorName: String,
   authorPic: String,
   authorF: String,
  upvotes: {
    type: Number,
    default: 0,
  },
  upvotesId: [{
    type: String
}],
  gameId: String,

  // BY REFERENCE INSTEAD OF SUBDOCUMENTS
  // product: { type: Schema.Types.ObjectId }
});

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
