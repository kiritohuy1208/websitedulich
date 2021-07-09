var express= require('express')
var router = express.Router()
var loaihoa= require('./../controllers/loaihoa')
var Hoa  = require('../models/hoa')
var Cart  = require('../models/cart')
var mongoose = require('mongoose');
const LoaiHoarepository = require('../repository/productType')
const Hoarepository = require('../repository/product')
const helper = require('../middleware/upload');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const uploadMultiple = helper.upload.fields([{
    name: 'images',
    maxCount: 4
}])
const {verifytokenadmin} = require('../middleware/auth')
const indexrepository = require('../repository/index')
// -----------------------


router.post('/themhoa',uploadMultiple,async (req,res)=>{
    var mahoa = 0
    var dataHoa = await Hoarepository.select()
    if(dataHoa){
        mahoa = (parseInt(dataHoa[dataHoa.length-1].mahoa)+1).toString()
    }else{
        mahoa = '1'
    }
    const listFileName = [];
    for (let file of req.files.images) {
        listFileName.push(file.filename);
        try{
            const result = await helper.uploadFile(file)
            await unlinkFile(file.path)
        }catch(err){
            console.log("Lỗi do uploadfile đến azure:"+err)
        }
        
    }
	// const hinh = req.files[0].filename;
    const hinh = listFileName
	const body = req.body;
	var newHoa = {mahoa:mahoa,maloai:body.loai,tenhoa:body.ten_hoa,giaban:body.gia_ban,hinh:hinh,mota:body.mo_ta}
    try{
        await Hoarepository.saveHoa(newHoa)
        res.redirect('/')
    }
	catch(err){
        console.log(err)
        res.redirect('/admin')
    }
})

router.put('/edit/:id',verifytokenadmin,uploadMultiple,async (req,res)=>{
    
    try{
        product = await Hoa.findById(req.params.id)
        if (req.files.images != undefined) {
            const listFileName = [];
            for (let file of req.files.images) {
                listFileName.push(file.filename);
                try{
                    const result = await helper.uploadFile(file)
                    await unlinkFile(file.path)
                }catch(err){
                    console.log("Lỗi do uploadfile đến azure:"+err)
                }
            }
            product.hinh = listFileName
        }
        const body = req.body
        product.tenhoa = body.ten_hoa
        product.giaban = body.gia_ban
        product.mota   = body.mo_ta   
        product.maloai =body.loai
        let cart
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        } else if (req.session.giohang){
            cart = await new Cart(req.session.giohang);
        }
        //Cập nhật giỏ hàng
        if(cart){
            const itemIndex = cart.items.findIndex((p)=>p.productId == product.id)
            // có sp sưa đổi tồn tại trong giỏ hàng
            if(itemIndex >-1){
                cart.items[itemIndex].price = Number(product.giaban )
                cart.items[itemIndex].title = product.tenhoa 
                let totalCost=0
                for(i=0;i<cart.items.length;i++){
                    totalCost +=  cart.items[i].qty*  cart.items[i].price
                }
                cart.totalCost = totalCost
                if(req.session.giohang){
                    req.session.giohang = cart
                }
                if (req.user) {
                    await cart.save()
                }    
            }
        }
        await product.save()
        res.redirect('/')
    }catch(err){
        console.log(err)
        res.redirect('/admin')
    }
})
router.delete('/delete/:id',async (req,res)=>{
    let product 
    try{
        product = await Hoa.findById(req.params.id)
        carts_haveProduct = await Cart.find({
            'items.productId':req.params.id
        })
        if(carts_haveProduct){
            for(const cart of carts_haveProduct ){
                let update_cart= []
                for( const item of cart.items){
                    if(item.productId != product.id){
                        update_cart.push(item)
                    }
                }
                cart.items = update_cart
                let totalCost=0, totalQty=0
                for(i=0;i<cart.items.length;i++){
                    totalCost +=   cart.items[i].qty*  cart.items[i].price
                    totalQty += cart.items[i].qty 
                }
                cart.totalCost = totalCost
                cart.totalQty = totalQty
              
                if(cart._id == req.session.giohang._id){
                    if(cart.totalQty == 0){
                        req.session.giohang =null
                    }else{
                        req.session.giohang = cart
                    }
                }
                await cart.save()
            }
        }
        await product.remove()
        res.redirect('/')
    }catch(err){
        console.log(err)
    }
})
router.get('/edit/:id', async (req,res)=>{
    loaihoa= await LoaiHoarepository.select()
    var notifycart= indexrepository.Hienthigiohang(req)
    user = req.user
    var productId = req.params.id
    try{
        product = await Hoa.findById(productId)
        res.render('admin_edit',{user:user,loaihoa:loaihoa,notifycart:notifycart,product:product})
    }catch(err){
        console.log(err)
        res.redirect('/')
    }

})
router.get('/',verifytokenadmin,async(req,res)=>{
    loaihoa= await LoaiHoarepository.select()
    var notifycart= indexrepository.Hienthigiohang(req)
    user = req.user
    if(user){
        res.render('admin_upload',{user:user,loaihoa:loaihoa,notifycart:notifycart})
    }else{
        res.redirect('/')
    }
})
module.exports = router