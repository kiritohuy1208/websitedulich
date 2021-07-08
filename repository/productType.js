const Typeflower = require('../models/loaihoa')
exports.select = async ()=>{
    
       return await Typeflower.find({})
 
}