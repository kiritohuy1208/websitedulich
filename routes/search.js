var express= require('express')
var router = express.Router()
var hoa= require('../controllers/hoa')
const {verifytoken} = require('../middleware/auth')

router.post('/',verifytoken,(req,res)=>{
  
    var keyword = req.body.keyword
   
    hoa.selectBykeyword(req,res,keyword)
 
 })
 module.exports = router