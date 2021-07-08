var express= require('express')
var router = express.Router()
const {verifytoken} = require('../middleware/auth')
const LoaiHoarepository = require('../repository/productType')
const Cartrepository = require('../repository/cart')
const indexrepository = require('../repository/index')
router.post('/capnhatgiohang',verifytoken,(req,res)=>{
 
    // for( i=0; i<req.session.giohang.length;i++){
    //     req.session.giohang[i].soluong = req.body.soluong[i].toString()
    // }
    // res.redirect('/shoppingcart')
    Cartrepository.updateCart(req,res)
})
router.get('/remove/:id',verifytoken,(req,res)=>{
    // mahoa= req.params.mahoa
    // for(i=0;i<req.session.giohang.length;i++){
    //     if(req.session.giohang[i].mahoa == mahoa ){
    //        req.session.giohang.splice(i,1)
    //        break
    //     }
    // }
    // res.redirect('/shoppingcart')
    Cartrepository.removeItemsCart(req,res)
})
router.get('/checkout',verifytoken, async (req,res)=>{
    if(req.user){
        if(!req.session.giohang){
            loaihoa= await LoaiHoarepository.select()
            var notifycart= indexrepository.Hienthigiohang(req)
            user = req.user
            res.render('checkout',{user:user,loaihoa:loaihoa,notifycart:notifycart,thongtinkh:user,ttgh:null})
        }else{
            loaihoa= await LoaiHoarepository.select()
            var notifycart= indexrepository.Hienthigiohang(req)
            user = req.user
            thongtingiohang = req.session.giohang
            res.render('checkout',{user:user,loaihoa:loaihoa,notifycart:notifycart,thongtinkh:user,ttgh:thongtingiohang})
        }
    }else{
        res.redirect('/login')
    }
  
})
router.get('/addtocart/:id',verifytoken,(req,res)=>{
   
    Cartrepository.handleCartVer2(req,res)
   
})
router.get('/',verifytoken,async (req,res)=>{
    Cartrepository.renderShoppingCart(req,res)
})
module.exports= router