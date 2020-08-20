'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionUserSchema = Schema({  
  _idOption: Schema.Types.ObjectId,
  _idTypeUser: Schema.Types.ObjectId,
});

module.exports = mongoose.model('OptionUser', OptionUserSchema);