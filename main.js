var express = require('express')
var app = express()
var dbConnect = require('./config/database')
// const morgan = require('morgan')
const cors = require('cors')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session');
const MongoStore = require('connect-mongo');
var cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const dotenv = require('dotenv')

// -------------------------------------------middleware-------------------------------------------------------------------
app.set('views',__dirname + '/views')
app.set('layout', 'layout')
app.set('view engine','ejs')
var publicDir = require('path').join(__dirname,'/public')
// app.use(morgan('dev'))
app.use(cors())
app.use(expressLayout)
app.use(express.static(publicDir))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
dotenv.config()
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: '1234567abc',
    store: MongoStore.create({    
        mongoUrl: 'mongodb://localhost:27017/quanlybanhoa',
        autoRemove: 'native' 
    }),
    // cookie:{maxAge: 14 * 24 * 60 * 60}
}))
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});

// sendmail
const sendmailRouter = require('./routes/sendmail')
app.use('/xulydonhang',sendmailRouter)
// -----------------------Admin-----------------------------------------
const routerAdmin = require('./routes/admin')
app.use('/admin',routerAdmin)
// -----------------------User Profile-----------------------------------
const routerProfile = require('./routes/profile')
app.use('/profile',routerProfile)
// ------------------------Giỏ hàng--------------------------------------
const routerShoppingcart = require('./routes/shoppingcart')
app.use('/shoppingcart',routerShoppingcart)
// ------------------------Login register Logout-------------------------
const loginRouter = require('./routes/sign_in')
app.use('/login',loginRouter)
const registerRouter = require('./routes/sign_up')
app.use('/register',registerRouter)
const logoutRouter= require('./routes/logout')
app.use('/logout',logoutRouter)
// -----------------------Sản phẩm---------------------------------------
const productRouter = require('./routes/product')
app.use('/hoa',productRouter)
// ------------------------Search-----------------------------------------
const seacrhRouter = require('./routes/search')
app.use('/timkiem',seacrhRouter)
// ------------------------index-----------------------------------------
const indexRouter= require('./routes/index')
app.use('/',indexRouter)


app.listen(5000,()=>{
    console.log("Server start on :",5000)
})