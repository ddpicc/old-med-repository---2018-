const mongoose = require('mongoose')
const medSchema = require('./medSchema')
var Schema = mongoose.Schema;

const ordSchema = new Schema({
    patient :String,
    orderalias: String,
    type : String,
    date: String,
    med : [Schema.Types.Mixed],
    dose : Number,
    total : Number,
    totalprofit : Number,
    editable : Boolean,
  }, { collection: 'myOrd'})

  module.exports = mongoose.model('ord',ordSchema);