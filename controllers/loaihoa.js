
var typeflower = require('../models/loaihoa')
module.exports.select= async function(req,res){
    var data = await typeflower.select()
    
     res.render('mhloaihoa',{useData:data})
}
