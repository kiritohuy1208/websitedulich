var mongoose = require ('mongoose')
var helper = require('./../middleware/upload')
var hoaSchema = new mongoose.Schema({
    mahoa: String,
    maloai : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Typeflower'
    },
    tenhoa:String,
    giaban:String,
    hinh:[{ type: String,required: true}],
    mota:String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true,
    getters: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

hoaSchema.virtual('fileLinks').get(function () {
    return this.hinh.map(e => helper.getFileLink(e));
});

module.exports = mongoose.model('Hoa',hoaSchema)
// Hoa = mongoose.model('Hoa',hoaSchema)
// module.exports.select = async function(object){
//     return await Hoa.find(object)
// }
// module.exports.saveHoa = async function(newhoa){
//     hoa = new Hoa(newhoa)
//     savehoa = await hoa.save()
//     return savehoa
// }
     