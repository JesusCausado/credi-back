'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = Schema({
  name: String,
  idTypeUser: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Menu', MenuSchema);