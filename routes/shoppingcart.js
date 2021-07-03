var express= require('express')
var router = express.Router()
var loaihoa= require('../controllers/loaihoa')
var Loaihoa= require('../models/loaihoa')
const {verifytoken} = require('../middleware/auth')
const helper = require('../middleware/upload');

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
async function handleCart(req,res){
    var query = req.query
  
    if(query.muahoa){
        
            if(req.session.giohang == undefined){
                // tạo giỏ hàng
                req.session.giohang = []
                var urlhinh = helper.getFileLink(query.hinh)
                var hoa ={
                    mahoa:query.muahoa,
                    tenhoa: query.tenhoa,
                    dongia: query.dongia,
                    soluong: 1,
                    hinh:urlhinh
                }
                req.session.giohang[0] = hoa
            }
            else{
                var dachon=0
                var urlhinh = helper.getFileLink(query.hinh)
                for(i=0;i<req.session.giohang.length;i++){
                    if(req.session.giohang[i].mahoa == query.muahoa){
                        req.session.giohang[i].soluong = req.session.giohang[i].soluong+1
                        dachon = 1
                        break
                    }
                    
                }
                
                if(dachon == 0){
                   
                    var hoa=({
                        mahoa:query.muahoa,
                        tenhoa: query.tenhoa,
                        dongia: query.dongia,
                        soluong: 1,
                        hinh:urlhinh
                    })
                    req.session.giohang[req.session.giohang.length] = hoa
                }
            }
            try{
                await req.session.save()
            }catch(err){
                console.log(err)
            }
            res.redirect('/')     
        }
}
router.post('/capnhatgiohang',(req,res)=>{
 
    for( i=0; i<req.session.giohang.length;i++){
    
        req.session.giohang[i].soluong = req.body.soluong[i].toString()
       
    }
    res.redirect('/shoppingcart')
})
router.get('/remove/:mahoa',(req,res)=>{
    mahoa= req.params.mahoa
    for(i=0;i<req.session.giohang.length;i++){
        if(req.session.giohang[i].mahoa == mahoa ){
           req.session.giohang.splice(i,1)
           break
        }
    }
    res.redirect('/shoppingcart')
})
router.get('/checkout',verifytoken, async (req,res)=>{
    // var stripe = Stripe('pk_test_51J87HnFasX3aDbBSTHdvOdqcOgmDdCZsVEUDDXTyNgHOHCUoqr7uscwm0e4LWRW4vHmWV3vpmmklSyDWdVPww0Jm0004omzyDw');
    if(req.session.cart){
        loaihoa= await Loaihoa.select()
        var notifycart= Hienthigiohang(req)
        user = req.user
        res.render('checkout',{user:user,loaihoa:loaihoa,notifycart:notifycart,thongtinkh:user})
    }else{
        res.redirect('/')
    }
  
})
router.get('/addtocart',(req,res)=>{
   
    handleCart(req,res)
   
})
router.get('/',verifytoken,async (req,res)=>{
   
    loaihoa= await Loaihoa.select()
    let ttgh
    if(req.session.giohang){
        ttgh = req.session.giohang
    }
    var notifycart= Hienthigiohang(req)
    res.render('shoppingcart',{user:req.user,loaihoa:loaihoa,ttgh:ttgh,notifycart:notifycart})    
})
module.exports= router