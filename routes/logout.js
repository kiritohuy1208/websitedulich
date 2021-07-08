var express= require('express')
var router = express.Router()
// logout session
// app.get('/logout',function(req,res,next){
// 	delete req.session.kh
//     delete req.session.giohang
// 	res.redirect('/')
// }
router.get('/',function(req,res,next){
    try {
        req.session.giohang = null;
        res.clearCookie("token");
        // res.clearCookie("user");
        res.redirect('/');
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
})
module.exports = router