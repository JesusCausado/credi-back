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
  idPrestamo: Schema.Types.ObjectId,
});

module.exports = mongoose.model('PrestamoDet', PrestamoDetSchema);