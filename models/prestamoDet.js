'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrestamoDetSchema = Schema({
  nroCuota: Number,
  aptInteres: Number,
  aptCapital: Number,
  vlrCuota: Number,
  vlrInteres: Number,
  fechaPago: Date,
  estado: String,
  vlrPagado: Number,
  retiroCajero: Number,
  entregadoCliente: Number,
  saldo: Number,
  idPrestamo: Schema.Types.ObjectId,
});

module.exports = mongoose.model('PrestamoDet', PrestamoDetSchema);