var express= require('express')
var router = express.Router()
var loaihoa= require('../controllers/loaihoa')
// var Loaihoa= require('../models/loaihoa')
const {accessToken} = require('../middleware/auth')
const LoaiHoarepository = require('../repository/productType')
const indexrepository = require('../repository/index')
const Cart = require("../models/cart");
const Hoa = require('../models/hoa')
// app.post('/login', (req,res)=>{
   
//     tendn = req.body.ten_dn
//     matkhau = req.body.mat_khau
//     dangnhap(req,res,tendn,matkhau)
   
// })
router.get('/',async(req,res)=>{
    loaihoa= await LoaiHoarepository.select()
    user=req.user
    var notifycart= indexrepository.Hienthigiohang(req)
    res.render('login',{layout:"layoutlogin",user:req.user,loaihoa:loaihoa,notifycart:notifycart})
})
router.post('/', accessToken, async (req,res,next)=>{
    try{
        let cart = await Cart.findOne({ user: req.userId });
        // neu use da tao session gio hang nhung chua co cart trong db
        if (req.session.giohang && !cart) {
            const cart = await new Cart(req.session.giohang);
            cart.user = req.userId;
            await cart.save();
        }
        //  nếu đã có user đã có cart trong db, tạo session cart
        if (cart && !req.session.giohang) {
             req.session.giohang = cart;
        }
        else if(cart && req.session.giohang){
            try{
                for(const itemgiohang of req.session.giohang.items){
                    const product = await Hoa.findById(itemgiohang.productId)
                    const itemIndex = cart.items.findIndex((p)=>p.productId == itemgiohang.productId)
                    if(itemIndex > -1){
                        cart.items[itemIndex].qty++
                        cart.items[itemIndex].price = cart.items[itemIndex].qty * parseInt(product.giaban)
                        cart.totalQty ++
                        cart.totalCost += parseInt(product.giaban) 
                    }else{
                        //  if sản phẩm ko tồn tai trong cart, 
                        //  tìm nó trong db để truy vấn giá của nó và thêm sản phẩm mới vào 
                        cart.items.push({
                            productId: itemgiohang.productId,
                            qty:1,
                            price: product.giaban,
                            title:product.tenhoa,
                            productCode: product.mahoa
                        })
                        cart.totalQty++
                        cart.totalCost += parseInt(product.giaban)
                    }  
                }
            req.session.giohang = cart
            await cart.save()
           
            }catch(err){
                console.log(err)
            }
               
        }
        if (req.session.oldUrl) {
            var oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);   
        } else {
            res.redirect('/admin');
        }   
    }catch(err){
        console.log(err)
        res.redirect('/login')
    }
 })
 async function productsFromCart(cart) {
   
    let products = []; // array of objects
    for (const item of cart.items) {
      let foundProduct = (
        await Hoa.findById(item.productId)
      ).toObject();
      foundProduct["qty"] = item.qty;
      foundProduct["totalPrice"] = item.price*item.qty;
      products.push(foundProduct);
    }
    return products;
}
 module.exports = router