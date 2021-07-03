
const jwt = require('jsonwebtoken');
var khachhang = require('../controllers/khachhang')
var Modelkhachang= require('../models/khachhang')
const verifytokenadmin = async function (req,res,next){
    try{
        var token = req.cookies.token
        if(!token){
            req.user=''
            next()
        }
        else{
            var verify = jwt.verify(token,'signature')
            // var useradmin = await Modelkhachang.find({ $and:[{_id:verify._id},{role:1}]})
            var user = await Modelkhachang.findById(verify._id)
            if(verify){
                req.user= user
                if(user.role == 1){
                  next()  
                } else{
                    res.redirect('/')
                }  
            }
        }
    }
    catch(err){
        res.redirect('/logout')
        console.log(err)
    }
}
const verifytoken = async function (req,res,next){
    try{
        var token = req.cookies.token
        if(!token){
            req.user=''
            next()
        }
        else{
            var verify = jwt.verify(token,'signature')
            var user = await Modelkhachang.findById(verify._id)
            if(verify){
                req.user= user
                next()
            }
        } 
    }
    catch(err){
        res.redirect('/logout')
       console.log(err)
    }
}
const accessToken = async function(req,res,next){
    tendn = req.body.ten_dn
    matkhau = req.body.mat_khau
    var kh = await khachhang.login(tendn,matkhau)
    token= jwt.sign({_id:kh._id},'signature',{expiresIn:'1h'})
    res.cookie("token", token);
    next()
}

module.exports={
    verifytoken,
    accessToken,
    verifytokenadmin
}