'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrestamoSchema = Schema({  
  nroPrestamo: Number,
  tipoPrestamo: String,
  ciudad: String,
  vlrSol: Number,
  vlrApr: Number,
  vlrEnt: Number,
  termino: String,
  interes: Number,
  saldo: Number,
  fechaGrab: Date,
  diaPago: String,
  estado: Boolean,
  idClient: Schema.Types.ObjectId,
  idUsuario: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Prestamo', PrestamoSchema);