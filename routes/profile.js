var express= require('express')
var router = express.Router()
// var loaihoa= require('../controllers/loaihoa')
var Loaihoa= require('../models/loaihoa')
const {verifytoken} = require('../middleware/auth')
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
router.get('/',verifytoken, async(req,res)=>{
    loaihoa= await Loaihoa.select()
    var notifycart= Hienthigiohang(req)
    user = req.user
    res.render('profile',{user:user,loaihoa:loaihoa,notifycart:notifycart,thongtinkh:user})
})
module.exports= router