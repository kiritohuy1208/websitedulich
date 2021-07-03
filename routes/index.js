
var express= require('express')
var router = express.Router()
var Loaihoa= require('../models/loaihoa')
var Hoa = require('../models/hoa')
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
async function renderindex(req,res,tranghienthi){
   
    let user,loaihoa,hoa
    loaihoa= await Loaihoa.select()
    hoa = await Hoa.select()
    user=req.user
    var notifycart= Hienthigiohang(req)
    res.render(tranghienthi,{user:user,loaihoa:loaihoa,hoa:hoa,notifycart:notifycart})
}
router.get('/',verifytoken,async (req,res)=>{

    renderindex(req,res,'index')
})
module.exports= router