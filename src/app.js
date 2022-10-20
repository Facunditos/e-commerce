require("dotenv").config();
const path=require("path");
const express=require('express');
const session = require("express-session");
const logger = require("morgan");
const fileUpload=require("express-fileupload");
const shopRouter=require("./routes/shop");
const authRouter=require("./routes/auth");
const usersRouter=require("./routes/users");
const categoriesRouter=require("./routes/categories");
const cartRouter=require("./routes/cart");
const transactionsRouter=require("./routes/transactions");
const productsRouter=require("./routes/products");
const cartMiddleware=require("../src/middlewares/cartMiddleware");
const swaggerUI=require("swagger-ui-express");
const swaggerJsDoc=require("swagger-jsdoc");
const swaggerSpec=require("./swagger/config");
const port=process.env.PORT||3030;

const app=express();

app.set ("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    debug:true
}));
app.use(session({
    secret:process.env.SECRET,
    saveUninitialized:true,
    resave:true
}));
app.use(cartMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/users/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/me/cart',cartRouter);
app.use('/api/v1/me/transactions',transactionsRouter);
app.use('/api/v1/me/products',productsRouter);
app.use('/api/v1/doc',swaggerUI.serve,swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
const router=express.Router();
app.use('/',router.get('/view',(req,res)=>res.render('form')));
app.use('/',router.post('/recieveFormPOST',(req,res)=>{
    res.json(req.body);
}));
app.use('/',router.get('/recieveFormGET',(req,res)=>{
    res.json(req.query);
}));
app.use('/',router.get('/recieveLink',(req,res)=>{
    res.json(req.query);
}));
app.listen(port,()=>console.log(`Server is running on the port ${port}`));
module.exports=app