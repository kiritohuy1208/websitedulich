var mongoose = require ('mongoose')

let ItemSchema = new  mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hoa",
      },
    qty: {
        type: Number,
        default: 0,
      },
    price: {
        type: Number,
        default: 0,
      },
    title: {
        type: String,
      },
    productCode: {
        type: String,
      },
})
var donhangSchema = new mongoose.Schema({
    // sohd:Number,
    // // hoten: {type:String},
    // hoten: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Khachhang",
    //   },
    // diachi : String,
    // dienthoai: Number,
    // email: String,
    // dsmh:[{
    //     mahoa: String,
    //     tenhoa:String,
    //     soluong:Number,
    //     dongia:String,
    //     thanhtien:Number
    // }],
    // total:Number
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Khachhang"
    },
    cart:{
        totalQty: {
            type: Number,
            default: 0,
            required: true,
          },
          totalCost: {
            type: Number,
            default: 0,
            required: true,
          },
          items:[
                     ItemSchema  
                    // {
                    //     productId: {
                    //         type: mongoose.Schema.Types.ObjectId,
                    //         ref: "Hoa",
                    //     },
                    //     qty: {
                    //         type: Number,
                    //         default: 0,
                    //     },
                    //     price: {
                    //         type: Number,
                    //         default: 0,
                    //     },
                    //     title: {
                    //         type: String,
                    //     },
                    //     productCode: {
                    //         type: String,
                    //     },
                    // },
                ],
        }, 
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    NumberPhone:{
        type: Number,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
},{timestamps : true})
module.exports =   mongoose.model('Donhang',donhangSchema)
// DataDonhang = mongoose.model('Donhang',donhangSchema)

// module.exports.select = async function(object){
//     var donhang = await DataDonhang.find(object)
//     return donhang
// }
// module.exports.insert = async function(newdonhang){
//     var bangdonhang = await DataDonhang.find().sort({sohd:1}).limit(1)
//     var sodh = 1
//     var total = 0
//     if(bangdonhang.length>0)
//         sodh = sodh +bangdonhang[0].sodh
//         for( i= 0 ;i <newdonhang.dsmh.length;i++){
//             total += newdonhang.dsmh[i].soluong*newdonhang.dsmh[i].dongia
//         }
//         const donhang = new DataDonhang({
//             sodh: sodh,
//             hoten: newdonhang.hoten,
//             diachi: newdonhang.diachi,
//             dienthoai: newdonhang.dienthoai,
//             email: newdonhang.email,
//             dsmh: newdonhang.dsmh,
//             total: total
//         })
//         var Data = await donhang.save()
//         return Data
    
// }


