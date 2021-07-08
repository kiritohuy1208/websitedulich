var express= require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var Donhang = require('../models/donhang')
var Cart = require('../models/cart')
const {verifytoken} = require('../middleware/auth')
async function sendmail(tomail,tieude,noidung){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'quanghuybtre2@gmail.com',
            pass: process.env.passwordmail
        }
    })
   //  const data = await ejs.renderFile(__dirname+"/views/billmail.ejs", { noidung: noidung });
    var mailOption = {
        from :'quanghuybtre2@gmail.com',
        to: tomail,
        subject: tieude,
        html: noidung
    }
    transporter.sendMail(mailOption,function(err,info){
        if(err){
            console.log(err)
        }else{
            console.log('Email sent: '+ info.response)
        }
    })
}

router.post('/',verifytoken,async (req,res)=>{
    var thongtin = req.body
    hoten = thongtin.hoten
    diachi = thongtin.diachi
    dienthoai = thongtin.dienthoai
    email = thongtin.email
    if(!req.session.giohang){
        return res.redirect('/shoppingcart')
    }
    const cart = await Cart.findById(req.session.giohang._id)
   
    const order = new Donhang({
        user: req.user._id,
        cart:{
            totalQty: cart.totalQty,
            totalCost: cart.totalCost,
            items: cart.items
        },
        email: email,
        address: diachi,
        NumberPhone: Number(dienthoai)
    })
  
    order.save(async (err,newOrder)=>{
        if(err){
            console.log(err)      
            req.flash("error", "Thanh toán thất bại. Vui lòng thử lại sau!!!");
            return  res.redirect('/shoppingcart/checkout')
        }
          
        ttctgh = "<h1 align= 'center' style='color:rgb(153, 220, 106)'>Thông tin đơn hàng tại shop Flowers</h1>"
        ttctgh += "<p><span style='color:blue'>Họ Tên:</span><b>"+ hoten +"</b></p>"
        ttctgh += "<p><span style='color:blue'>Địa chỉ giao hàng:</span><b>"+ diachi +"</b></p>"
        ttctgh += "<p><span style='color:blue'>Email:</span><b>"+ email +"</b></p>"
        ttctgh += "<p><span style='color:blue'>Số điện thoại:</span><b>"+ dienthoai  +"</b></p>"
        ttctgh += "<table width: '80%' cellspacing='0' cellpadding= '2' border='1'>"
        ttctgh += "<tr><td width ='10%'>Stt</td><td width: '10%'>Mã hoa</td><td width: '30%'>Tên hoa</td><td width: '10%'>Số lượng</td><td width: '15%'>Đơn giá</td><td>Thành tiền</td></tr>"
        var stt =1 
        for(i=0; i<cart.items.length;i++){
            ttctgh = ttctgh +"<tr><td>"+stt+"</td><td>"+cart.items[i].productCode+"</td><td>"+cart.items[i].title+"</td><td>"+cart.items[i].qty+"</td><td>"+cart.items[i].price/cart.items[i].qty+"</td><td>"+ cart.items[i].price+"</td></tr>"
            stt++;
        }
        ttctgh = ttctgh + "<tr><td colspan='7' align ='right'>Tổng tiền :"+cart.totalCost+"</td</tr></table>"
        ttctgh = ttctgh + "<tr><td colspan='7' align ='right'>Tổng Sản phẩm :"+cart.totalQty+"</td</tr></table>"
        ttctgh = ttctgh + "<p><b><i>Cảm ơn quý khách đã đặt hàng, đơn hàng sẽ chuyển đến quý khách trong thời gian sớm nhất</i><b></p>"
        sendmail(email,"Thông tin đơn hàng shop Flowers",ttctgh)
        await cart.save()
        await Cart.findByIdAndDelete(cart._id)
        req.session.giohang = null
        req.flash("success", "Thanh toán thành công");
        res.redirect('/shoppingcart/checkout')
    })
    // var dh = {
    //     sodh:1,
    //     hoten:hoten,
    //     diachi: diachi,
    //     dienthoai: dienthoai,
    //     email: email
    // }
    // dh.dsmh = req.session.giohang.items


        // kq = Donhang.insert(dh)
        // giohang = req.session.giohang
        // if(kq){
        //     req.session.giohang = null
        // }
        
        // ttctgh = "<h1 align= 'center' style='color:rgb(153, 220, 106)'>Thông tin đơn hàng tại shop Flowers</h1>"
        // ttctgh += "<p><span style='color:blue'>Họ Tên:</span><b>"+ hoten +"</b></p>"
        // ttctgh += "<p><span style='color:blue'>Địa chỉ giao hàng:</span><b>"+ diachi +"</b></p>"
        // ttctgh += "<p><span style='color:blue'>Email:</span><b>"+ email +"</b></p>"
        // ttctgh += "<p><span style='color:blue'>Số điện thoại:</span><b>"+ dienthoai  +"</b></p>"
        // ttctgh += "<table width: '80%' cellspacing='0' cellpadding= '2' border='1'>"
        // ttctgh += "<tr><td width ='10%'>Stt</td><td width: '10%'>Mã hoa</td><td width: '30%'>Tên hoa</td><td width: '10%'>Số lượng</td><td width: '15%'>Đơn giá</td><td>Thành tiền</td></tr>"
        // var stt =1 
        // var tongtien =0
        // for(i=0; i<giohang.length;i++){
        //     ttctgh = ttctgh +"<tr><td>"+stt+"</td><td>"+giohang[i].mahoa+"</td><td>"+giohang[i].tenhoa+"</td><td>"+giohang[i].soluong+"</td><td>"+giohang[i].dongia+"</td><td>"+ giohang[i].soluong*giohang[i].dongia+"</td></tr>"
        //     stt++;
        //     tongtien = tongtien + giohang[i].soluong*giohang[i].dongia
        // }
        // ttctgh = ttctgh + "<tr><td colspan='7' align ='right'>Tổng tiền :"+tongtien+"</td</tr></table>"
        // ttctgh = ttctgh + "<p><b><i>Cảm ơn quý khách đã đặt hàng, đơn hàng sẽ chuyển đến quý khách trong thời gian sớm nhất</i><b></p>"
        // sendmail(email,"Thông tin đơn hàng shop Flowers",ttctgh)
})
module.exports = router
