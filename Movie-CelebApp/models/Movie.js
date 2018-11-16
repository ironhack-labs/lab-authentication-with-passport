const mongoose = require('mongoose');
// create a new schema object
const Schema   = mongoose.Schema;



// you only need to do {type: string} if you are adding more rules like a default or minlength
const MovieSchema = new Schema({
    title: String,
    Celebrity: {type: Schema.Types.ObjectId, ref: 'Celebrity'},
    description: String,
    rating: Number,
    image: String,
    donor: {type: Schema.Types.ObjectId, ref: 'User'}
  });

//3.1 you create the cat class using those rules
const Movie = mongoose.model('Movie', MovieSchema);


module.exports = Movie;