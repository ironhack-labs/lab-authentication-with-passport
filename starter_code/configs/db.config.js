const mongoose = require ('mongoose');
const DB_NAME = 'passport-local';
const DB_URI = `mongodb://localhost/${DB_NAME}`;


mongoose.Promise = Promise;
mongoose
  .connect(DB_URI, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
});
