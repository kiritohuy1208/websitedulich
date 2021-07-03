var Khachhang = require('./../models/khachhang')

module.exports.login = async function(tendn,matkhau){
    // var dskh = await Khachhang.select({tendn:tendn,matkhau:matkhau})
    try{
        var dskh = await Khachhang.find({tendn:tendn,matkhau:matkhau})
        if(dskh.length >0) return dskh[0];
    }
    catch(err){
        return ''
    }
   
   
}

module.exports.register = async function(user){
    const khachhang = new Khachhang({
        tendn: user.tendn,
        matkhau: user.matkhau,
        hoten: user.hoten,
        diachi: user.diachi,
        dienthoai: user.dienthoai,
        email: user.email
    })
    await khachhang.save()
    // try{
       
    // }
    // catch(err){
    //     return err
    // }
    return khachhang
}