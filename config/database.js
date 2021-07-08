
var mongoose = require('mongoose')
// mongodb://localhost:27017/quanlybanhoa
mongoose.connect('mongodb://localhost:27017/quanlybanhoa',{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(()=>console.log("Db connected"))
    .catch((err)=>console.log(err.msg))
    

module.exports = mongoose