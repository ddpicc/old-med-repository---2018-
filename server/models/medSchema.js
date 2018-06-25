const mongoose = require('mongoose')

const medSchema = mongoose.Schema({
  medname :String,
  spec : String,
  count : String,
  baseprice : String,
  actualprice : String,
  sellprice: String,
  explain:String
}, { collection: 'myMed'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据

module.exports = mongoose.model('med',medSchema);
