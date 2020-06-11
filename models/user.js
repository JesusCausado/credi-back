'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  LastName: String,
  user: String,
  email: String,
  password: String
});

module.exports = mongoose.model('User', UserSchema);
