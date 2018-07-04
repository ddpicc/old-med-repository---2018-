const mongoose = require('mongoose')

const medSchema = mongoose.Schema({
  medname :String,
  alias: String,
  spec : String,
  count : Number,
  baseprice : Number,
  sellprice : Number,
  profit: Number,
}, { collection: 'myMed'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据

module.exports = mongoose.model('med',medSchema);
