
var express= require('express')
var router = express.Router()
var hoa= require('../controllers/hoa')
const {verifytoken} = require('../middleware/auth')

router.get('/:id',verifytoken,(req,res)=>{
    var productType_id = req.params.id.toString() 
    hoa.selectByMaloai(req,res,productType_id)
})
router.get('/chitiet/:mahoa',verifytoken,(req,res)=>{
    var mahoa = req.params.mahoa
    hoa.selectByMahoa(req,res,mahoa)
})
module.exports = router