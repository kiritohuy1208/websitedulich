var express= require('express')
var router = express.Router()
// var loaihoa= require('../controllers/loaihoa')
// var Loaihoa= require('../models/loaihoa')
const {verifytoken} = require('../middleware/auth')
const LoaiHoarepository =require ('./../repository/productType')
const indexrepository =require ('./../repository/index')

router.get('/',verifytoken, async(req,res)=>{
    loaihoa= await LoaiHoarepository.select()
    var notifycart= indexrepository.Hienthigiohang(req)
    user = req.user
    res.render('profile',{user:user,loaihoa:loaihoa,notifycart:notifycart,thongtinkh:user})
})
module.exports= router