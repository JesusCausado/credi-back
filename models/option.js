'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionSchema = Schema({
  name: String,
  state: Boolean,
  systemName: String,
  route: String,
  _idMenu: Schema.Types.ObjectId,
});

module.exports = mongoose.model('Option', OptionSchema);