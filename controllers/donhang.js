var Donhang = require('../models/donhang')
module.exports.select = async function(sodh){
    var dsdonhang = await Donhang.select({sodh:sodh})
    dsmh = dsdonhang.dsmh
}
module.exports.insert = async function(dh){
    try{
        createdh = await Donhang.insert(dh)
        return createdh
    }
    catch(err){
       
        return 
    }

}