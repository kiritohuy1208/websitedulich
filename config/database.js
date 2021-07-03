
var mongoose = require('mongoose')

    mongoose.connect('mongodb://localhost:27017/quanlybanhoa',{
        useNewUrlParser:true,
        useUnifiedTopology: true
    })
    .then(()=>console.log("Db connected"))
    .catch((err)=>console.log(err.msg))
    

module.exports = mongoose