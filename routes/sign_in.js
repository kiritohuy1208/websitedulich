var express= require('express')
var router = express.Router()
var loaihoa= require('../controllers/loaihoa')
var Loaihoa= require('../models/loaihoa')
const {accessToken} = require('../middleware/auth')
// app.post('/login', (req,res)=>{
   
//     tendn = req.body.ten_dn
//     matkhau = req.body.mat_khau
//     dangnhap(req,res,tendn,matkhau)
   
// })
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
router.get('/',async(req,res)=>{
    loaihoa= await Loaihoa.select()
    user=req.user
    var notifycart= Hienthigiohang(req)
    res.render('login',{layout:"layoutlogin",user:req.user,loaihoa:loaihoa,notifycart:notifycart})
})
router.post('/', accessToken,async (req,res,next)=>{
    try{
        res.redirect('/admin');
    }catch(err){
        console.log(err)
        res.redirect('/login')
    }
 },(req,res,next)=>{
     res.redirect('/')
 })
 module.exports = router