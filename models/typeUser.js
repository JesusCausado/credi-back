'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeUserSchema = Schema({
  name: String,
  description: String,
  admin: Boolean
});

module.exports = mongoose.model('TypeUser', TypeUserSchema);