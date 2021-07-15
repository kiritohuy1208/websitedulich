const Cart = require("../models/cart");
const Hoa = require('../models/hoa')
const indexrepository = require('../repository/index')
const LoaiHoarepository = require('../repository/productType')

// sử lý giỏ hàng với session
// exports.handleCart = async (req,res)=>{
//     var query = req.query
//     if(query.muahoa){
//             if(req.session.giohang == undefined){
//                 // tạo giỏ hàng
//                 req.session.giohang = []
//                 var urlhinh = helper.getFileLink(query.hinh)
//                 var hoa ={
//                     mahoa:query.muahoa,
//                     tenhoa: query.tenhoa,
//                     dongia: query.dongia,
//                     soluong: 1,
//                     hinh:urlhinh
//                 }
//                 req.session.giohang[0] = hoa
//             }
//             else{
//                 var dachon=0
//                 var urlhinh = helper.getFileLink(query.hinh)
//                 for(i=0;i<req.session.giohang.length;i++){
//                     if(req.session.giohang[i].mahoa == query.muahoa){
//                         req.session.giohang[i].soluong = req.session.giohang[i].soluong+1
//                         dachon = 1
//                         break
//                     }    
//                 }
//                 if(dachon == 0){
                   
//                     var hoa=({
//                         mahoa:query.muahoa,
//                         tenhoa: query.tenhoa,
//                         dongia: query.dongia,
//                         soluong: 1,
//                         hinh:urlhinh
//                     })
//                     req.session.giohang[req.session.giohang.length] = hoa
//                 }
//             }
//             try{
//                 await req.session.save()
//             }catch(err){
//                 console.log(err)
//             }
//             res.redirect('/')     
//         }
// }
exports.handleCartVer2 = async (req,res)=>{
    const productId = req.params.id
    if(productId){
        try{
            let user_cart
            // nếu user đã đăng nhập
            if(req.user){
                user_cart = await Cart.findOne({user:req.user.id})
            }
            let cart
            if((req.user && !user_cart && req.session.giohang)||(!req.user && req.session.giohang))
            {
                cart = await new Cart(req.session.giohang)
            }else if(!req.user || !user_cart){
                cart = new Cart({})
            }else{
                cart = user_cart
            }
            //  thêm sản phẩm vào cart
            const product = await Hoa.findById(productId)
            const itemIndex = cart.items.findIndex((p)=>p.productId == productId)
            // if sản phẩm tồn tại trong cart, cập nhật lại số lượng quantity
            if(itemIndex > -1){
                cart.items[itemIndex].qty++
                // cart.items[itemIndex].price +=  parseInt(product.giaban)*cart.items[itemIndex].qty
                cart.totalQty ++
                cart.totalCost += parseInt(product.giaban) 
            }else{
                //  if sản phẩm ko tồn tai trong cart, 
                //  tìm nó trong db để truy vấn giá của nó và thêm sản phẩm mới vào 
                cart.items.push({
                    productId: productId,
                    qty:1,
                    price: product.giaban,
                    title:product.tenhoa,
                    productCode: product.mahoa
                })
                cart.totalQty++
                cart.totalCost += parseInt(product.giaban)
            }  
            // nếu ng dùng đã đăng nhập, lưu trữ id_user và lưu cart đến db
            if(req.user ){
                try{
                    cart.user = req.user._id
                    await cart.save()
                }catch(err){
                    console.log(err) 
                }     
            }
          
            req.session.giohang = cart
        //    return res.redirect(req.headers.referer)
        res.redirect('/')
        }catch(err){
            console.log(err.message)
           return res.redirect('/')
        }
    }
}
exports.renderShoppingCart = async (req,res)=>{
    try{
        loaihoa= await LoaiHoarepository.select()
        let ttgh
        if(req.session.giohang){
            ttgh = req.session.giohang
        }
        var notifycart= indexrepository.Hienthigiohang(req)
        // tìm cart trong db nếu user đăng nhập
        let cart_user;
        if(req.user){
            cart_user = await Cart.findOne({user: req.user._id}) 
        }
        // nếu user đã đăng nhập và có cart, lấy cart user từ db
        if(req.user && cart_user){
            req.session.giohang = cart_user
            return res.render('shoppingcart',{
                user:req.user,
                loaihoa:loaihoa,
                ttgh:  await productsFromCart(cart_user),
                cart : cart_user,
                notifycart:notifycart,
            })
        }
        //nếu ko có cart trong session và user chưa login, cart sẽ empty
        if(!req.session.giohang){
            return res.render('shoppingcart',{
                user:req.user,
                loaihoa:loaihoa,
                ttgh:  null,
                cart : null,
                notifycart:notifycart,
            })
        }
        return res.render('shoppingcart',{
            user:req.user,
            loaihoa:loaihoa,
            ttgh:await productsFromCart(req.session.giohang),
            cart : req.session.giohang,
            notifycart:notifycart,
        })
    }catch(err){
        console.log(err)
       res.redirect('/')
    }
}
exports.updateCart = async (req,res)=>{
    // const productId = req.params.id;
    let cart; 
    try{
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
          } else if (req.session.giohang){
            cart = await new Cart(req.session.giohang);
          }
    //Cập nhật số lượng sp  
    if(cart){
        cart.totalCost= 0
    }
    let totalCost=0 , totalQty=0
    for(i=0;i<cart.items.length;i++){
        cart.items[i].qty = Number(req.body.soluong[i])
        totalCost += cart.items[i].price*cart.items[i].qty
        totalQty += cart.items[i].qty 
    }
    cart.totalCost = totalCost
    cart.totalQty = totalQty
    
    for(i=0;i<cart.items.length;i++){
      if(cart.items[i].qty <= 0){
            cart.items.splice(i,1)
            break
      }
    } 
    if((cart.items.length == 0 )||(cart.totalQty <= 0)){     
        req.session.giohang=  null
        await Cart.findByIdAndRemove(cart._id)
        return res.redirect('/shoppingcart')
    }else{
        req.session.giohang = cart
    }
    if (req.user) {
        await cart.save()
    }    
    res.redirect(req.headers.referer)
    }catch(err){
        console.log(err)
        res.redirect('/')
    }
}
exports.removeItemsCart= async (req,res)=>{
    const productId = req.params.id
    let cart
    try{
        if(req.user){
            cart = await Cart.findOne({user:req.user._id})
        }else if(req.session.giohang){
            cart = await new Cart(req.session.giohang)
        }
        // tìm item với productId
        // console.log(cart)
        let itemIndex = cart.items.findIndex((p)=> p.productId == productId)
        if(itemIndex > -1){
            cart.totalQty -= cart.items[itemIndex].qty
            cart.totalCost -= cart.items[itemIndex].price*cart.items[itemIndex].qty
            await cart.items.remove({_id: cart.items[itemIndex]._id})
        }
        req.session.giohang = cart
        if(req.user){
            await cart.save()
        }
        if(cart.totalQty <=0){
            req.session.giohang = null
            await Cart.findByIdAndRemove(cart._id)
        }
        res.redirect(req.headers.referer)
    }catch(err){
        console.log(err.message)
        res.redirect('/')
    }
}
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
   