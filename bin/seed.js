
const mongoose = require('mongoose')
const User = require('../models/user.model')


const dbName = 'lab-authentication-with-passport'
mongoose.connect(`mongodb://localhost/${dbName}`)


const users = [{
    username: 'Pepe',
    password: 'Juan'
  },]



User
  .create(users)
  .then(allUsers => {
    console.log(`Se han creado ${allUsers.length} users`)
    mongoose.connection.close()
  })
  .catch(err => console.log('Hubo un error,', err))
