'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OptionUserSchema = Schema({  
  idOption: Schema.Types.ObjectId,
  idTypeUser: Schema.Types.ObjectId,
});

module.exports = mongoose.model('OptionUser', OptionUserSchema);