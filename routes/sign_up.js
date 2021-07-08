var express= require('express')
var router = express.Router()
var khachhang = require('../controllers/khachhang')
const LoaiHoarepository = require('../repository/productType')
// const Cart = require("../models/cart");
const indexrepository =require('../repository/index')
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
    loaihoa= await LoaiHoarepository.select()
    var notifycart= indexrepository.Hienthigiohang(req)
    user = req.user
    res.render('register',{user:user,loaihoa:loaihoa,notifycart:notifycart})
})
module.exports= router