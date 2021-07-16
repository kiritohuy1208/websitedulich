
var mongoose = require('mongoose')
// mongodb://localhost:27017/quanlybanhoa
mongoose.connect('mongodb+srv://HuyTo1208:quanghuy1208@cluster0.66wio.mongodb.net/quanlybanhoa?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(()=>console.log("Db connected"))
    .catch((err)=>console.log(err.msg))
    

module.exports = mongoose