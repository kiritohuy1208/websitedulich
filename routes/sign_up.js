var express= require('express')
var router = express.Router()
// var loaihoa= require('../controllers/loaihoa')
var Loaihoa= require('../models/loaihoa')
var khachhang = require('../controllers/khachhang')
async function dangky(req,res,user){
    try{
        await khachhang.register(user)
        res.redirect('/login')
    }
    catch(err){
        console.log(err)
        res.redirect('/register')
    }
}
function Hienthigiohang(req){
    var giohang = req.session.giohang 
    var ttgh={
        soluong: 0,
        tongtien: 0
    }
    if(giohang){
        for(i=0;i<giohang.length;i++){
           
            ttgh.tongtien += giohang[i].dongia*giohang[i].soluong
        }
        ttgh.soluong = giohang.length
    }
    return ttgh
}

router.post('/',(req,res)=>{
    var body = req.body
    var user = {
        tendn: body.tendn,
        matkhau: body.password,
        hoten: body.hoten,
        diachi: body.diachi,
        dienthoai:body.region+body.dienthoai,
        email: body.email
    }
    dangky(req,res,user)
   
})
router.get('/',async(req,res)=>{
    let loaihoa
    loaihoa= await Loaihoa.select()
    var notifycart= Hienthigiohang(req)
    user = req.user
    res.render('register',{user:user,loaihoa:loaihoa,notifycart:notifycart})
})
module.exports= router