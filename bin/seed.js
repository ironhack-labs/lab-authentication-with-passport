const mongoose = require('mongoose')
const User = require('../models/user.model')
const dbName = 'passportdb';
mongoose.connect(`mongodb://localhost/${dbName}`, {
    userCreateIndex: true,
    userNewUrlParser: true,
    useUnifiedTopology: true,
});
// const user = [
//     {
//         username: 'Carlos Tevez',
//         password: 'Futbolista',
       
//     },
//     {
//         username: 'Lukas Podolski',
//         password: 'Futbolista',
        
//     },
//     {
//         username: 'Christina Aguilera',
//         password: 'Cantante',
        
//     },
// ];

User
    .create(user)
    .then((userFromDB) => {
        console.log(`Created ${userFromDB.length} users`);
        mongoose.connection.close();
    })
    .catch((err) =>
        console.log('Ha habido un error,', err))






