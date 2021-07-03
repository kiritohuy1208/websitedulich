var mongoose = require ('mongoose')

var khachhangSchema = new mongoose.Schema({
   tendn: String,
   matkhau: String,
   hoten: String,
   diachi: String,
   dienthoai: Number,
   email: String,
   role:{type:Number, default:0}
})


// khachhangSchema.virtual('select').get(function(object){
//         return schema.find(object)
// })    
// module.exports.select = async function(object){
//     return await schema.find(object)
// }
// module.exports.save= async function(khachhang){
//     return await schema.save(khachhang)
// }

 module.exports = mongoose.model('Khachhang',khachhangSchema) 
     