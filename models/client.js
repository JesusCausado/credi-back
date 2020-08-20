'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClientSchema = Schema({
  lastName: String,
  name: String,
  tipoDoc: String,
  nroDoc: String,
  lugarExp: String,
  fechaExp: Date,
  sexo: String,
  lugarNac: String,
  fechaNac: Date,
  estadoCivil: String,
  state: Boolean  
});

module.exports = mongoose.model('Client', ClientSchema);