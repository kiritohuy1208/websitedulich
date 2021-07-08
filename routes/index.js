
var express= require('express')
var router = express.Router()
// var Loaihoa= require('../models/loaihoa')
// var Hoa = require('../models/hoa')
const Hoarepository = require('../repository/product')
const LoaiHoarepository = require('../repository/productType')
const {verifytoken} = require('../middleware/auth')
const indexrepository = require('../repository/index')

async function renderindex(req,res,tranghienthi){
   
    let user,loaihoa,hoa
    loaihoa= await LoaiHoarepository.select()
    hoa = await Hoarepository.select()
    user=req.user
    var notifycart= indexrepository.Hienthigiohang(req)
    res.render(tranghienthi,{user:user,loaihoa:loaihoa,hoa:hoa,notifycart:notifycart})
}
router.get('/',verifytoken,async (req,res)=>{
    renderindex(req,res,'index')
})
module.exports= router