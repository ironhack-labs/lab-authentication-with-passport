 const mongoose = require('mongoose');

 mongoose.connect(process.env.DB, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
   .then(x => {
     console.log(`Ostias que me he conectado! El nombre de la Database: "${x.connections[0].name}"`)
   })
   .catch(err => {
     console.error('Esta chungo conectarse a la Database...', err)
   });

 module.exports = mongoose