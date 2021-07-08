const Hoa = require("../models/hoa")

const select =async (object)=>{
        return await Hoa.find(object)
}
const saveHoa = async function(newhoa){
    
    hoa = new Hoa(newhoa)
    savehoa = await hoa.save()
    return savehoa
}

module.exports = {
    select,saveHoa
}