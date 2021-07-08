
var flower = require('../models/hoa')
// var Loaihoa= require('./../models/loaihoa')
const HoaRepository = require ('./../repository/product')
const LoaiHoarepository =require ('./../repository/productType')
const indexrepository =require ('./../repository/index')

module.exports.select= async function(){
    var data = await HoaRepository.select()
    return data
    
}
module.exports.selectByMaloai= async function(req,res,id_type){
    try{
        var data = await HoaRepository.select({maloai:id_type})
        var loaihoa= await LoaiHoarepository.select()
        user=req.user
        var notifycart= indexrepository.Hienthigiohang(req)
        res.render('mhhoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
   
}
module.exports.selectByMahoa= async function(req,res,mahoa){
    var data = await HoaRepository.select({mahoa:mahoa})
    var loaihoa= await LoaiHoarepository.select()
    user=req.user
    var notifycart= indexrepository.Hienthigiohang(req)
    res.render('chitiethoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
}
module.exports.selectBykeyword= async function(req,res,keyword){
    var loaihoa= await LoaiHoarepository.select()
    user=req.user
    tentimkiem=String(keyword)
    var dshoa = await HoaRepository.select()
    var data =  dshoa.filter((hoa) => {	
        return hoa.tenhoa.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    });
    var notifycart= indexrepository.Hienthigiohang(req)
    res.render('mhhoa',{useData:data,user:user,loaihoa:loaihoa,notifycart:notifycart})
}
module.exports.saveHoa = async function(newhoa){
    
    hoa = new flower(newhoa)
    savehoa = await hoa.save()
    return savehoa
}
