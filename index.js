'use sctrict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 4000;
//var mongoURI = "mongodb://127.0.0.1:27017/credits";
//var mongoURI = "mongodb://mongo/credits";
var mongoURI = 'mongodb+srv://jesus:123@cluster0.txrbe.mongodb.net/credits?retryWrites=true&w=majority';

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => {
    console.log('Sesion iniciada correctamente! ' + db.connection.host)

    //Create server
    app.listen(port, () => {  
      console.log('Servidor corriendo en http://localhost:', port);
    });
  }).catch((err) => {
    console.log('Error al conectar la bd!', err);   
  });