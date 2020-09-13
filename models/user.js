'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  lastName: String,
  user: String,
  email: String,
  password: String,
  salt: String,
  idTypeUser: Schema.Types.ObjectId
});

module.exports = mongoose.model('User', UserSchema);
