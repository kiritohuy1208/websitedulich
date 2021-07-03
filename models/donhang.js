var mongoose = require ('mongoose')

var donhangSchema = new mongoose.Schema({
    sohd:Number,
    hoten: String,
    diachi : String,
    dienthoai: Number,
    email: String,
    dsmh:[{
        mahoa: String,
        tenhoa:String,
        soluong:Number,
        dongia:String,
        thanhtien:Number
    }],
    total:Number
   
})
DataDonhang = mongoose.model('Donhang',donhangSchema)
    
module.exports.select = async function(object){
    var donhang = await DataDonhang.find(object)
    return donhang
}
module.exports.insert = async function(newdonhang){
    var bangdonhang = await DataDonhang.find().sort({sohd:1}).limit(1)
    var sodh = 1
    var total = 0
    if(bangdonhang.length>0)
        sodh = sodh +bangdonhang[0].sodh
        for( i= 0 ;i <newdonhang.dsmh.length;i++){
            total += newdonhang.dsmh[i].soluong*newdonhang.dsmh[i].dongia
        }
        const donhang = new DataDonhang({
            sodh: sodh,
            hoten: newdonhang.hoten,
            diachi: newdonhang.diachi,
            dienthoai: newdonhang.dienthoai,
            email: newdonhang.email,
            dsmh: newdonhang.dsmh,
            total: total
        })
        var Data = await donhang.save()
        return Data
    
}
     