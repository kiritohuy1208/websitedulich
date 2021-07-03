
var flower = require('../models/hoa')
var Loaihoa= require('./../models/loaihoa')

function Hienthigiohang(req){
    var giohang = req.session.giohang 
    var ttgh={
        soluong: 0,
        tongtien: 0
    }
   
    if(giohang){
        for(i=0;i<giohang.length;i++){
            ttgh.soluong += giohang[i].soluong
            ttgh.tongtien += giohang[i].dongia*giohang[i].soluong
        }
    }
    return ttgh
}
module.exports.select= async function(){
    var data = await flower.select()
    return data
    
}
module.exports.selectByMaloai= async function(req,res,maloai){
    var data = await flower.select({maloai:maloai})
    var loaihoa= await Loaihoa.select()
    user=req.user
    var notifycart= Hienthigiohang(req)
    res.render('mhhoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
}
module.exports.selectByMahoa= async function(req,res,mahoa){
    var data = await flower.select({mahoa:mahoa})
    var loaihoa= await Loaihoa.select()
    user=req.user
    var notifycart= Hienthigiohang(req)
    res.render('chitiethoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
}
module.exports.selectBykeyword= async function(req,res,keyword){
    var loaihoa= await Loaihoa.select()
    user=req.user
    tentimkiem=String(keyword)
    var dshoa = await flower.select()
    var data =  dshoa.filter((hoa) => {	
        return hoa.tenhoa.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    });
    var notifycart= Hienthigiohang(req)
    res.render('mhhoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
}
module.exports.saveHoa = async function(newhoa){
    
    hoa = new flower(newhoa)
    savehoa = await hoa.save()
    return savehoa
}
