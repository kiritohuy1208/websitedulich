
var express= require('express')
var router = express.Router()
var hoa= require('../controllers/hoa')
const {verifytoken} = require('../middleware/auth')

router.get('/:maloai',verifytoken,(req,res)=>{
    var maloai = req.params.maloai
    hoa.selectByMaloai(req,res,maloai)
})
router.get('/chitiet/:mahoa',verifytoken,(req,res)=>{
    var mahoa = req.params.mahoa
    hoa.selectByMahoa(req,res,mahoa)
})
module.exports = router