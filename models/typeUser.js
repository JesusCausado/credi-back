'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TypeUserSchema = Schema({
  name: String,
  description: String,
  superAdmin: Boolean,
  admin: Boolean
});

module.exports = mongoose.model('TypeUser', TypeUserSchema);