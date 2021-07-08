


exports.Hienthigiohang= (req)=>{

    var giohang = req.session.giohang 
    var ttgh
    if(giohang){
       ttgh=giohang.totalQty
    }else{
        ttgh= 0
    }
    return ttgh
}