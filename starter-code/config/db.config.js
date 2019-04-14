const mongoose    = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-with-passport'

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true })
  .then( () => { console.info(`Connected to Mongo! Database name: "${MONGODB_URI}"`) })
  .catch( error => { console.error('Error connecting to mongo', error) });