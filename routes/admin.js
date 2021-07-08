var express= require('express')
var router = express.Router()
var loaihoa= require('./../controllers/loaihoa')

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