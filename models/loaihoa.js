var mongoose = require ('mongoose')

var loaihoaSchema = new mongoose.Schema({
    maloai: String,
    tenloai : String
})

// module.exports.select = async function(){
//     return await mongoose.model('typeflower',loaihoaSchema).find({})
// }
module.exports = mongoose.model('Typeflower',loaihoaSchema)
     