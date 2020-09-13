'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AsesorSchema = Schema({
  idPrestamista: Schema.Types.ObjectId,
  idAsesor: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Asesor', AsesorSchema);