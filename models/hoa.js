var mongoose = require ('mongoose')
var helper = require('./../middleware/upload')
var hoaSchema = new mongoose.Schema({
    mahoa: String,
    maloai : String,
    tenhoa:String,
    giaban:String,
    hinh:[{ type: String,required: true}],
    mota:String
})

hoaSchema.virtual('fileLinks').get(function () {
    return this.hinh.map(e => helper.getFileLink(e));
});

Hoa = mongoose.model('Hoa',hoaSchema)

// hoaSchema.virtual('fileLinks').get(function () {
//     return this.hinh.map(e => helper.getFileLink(e));
// });
//  module.exports = mongoose.model('flower',hoaSchema)
module.exports.select = async function(object){
    return await Hoa.find(object)
}
module.exports.saveHoa = async function(newhoa){
    
    hoa = new Hoa(newhoa)
    savehoa = await hoa.save()
    return savehoa
}
     