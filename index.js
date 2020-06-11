'use sctrict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 4000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/credits', { useNewUrlParser: true })
  .then(() => {
    console.log('Sesion iniciada correctamente!');

    //Create server
    app.listen(port, () => {
      console.log('Servidor corriendo en http://localhost:' + port);
    });
  });