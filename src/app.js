require("dotenv").config();
const path=require("path");
const express=require('express');
const session = require("express-session");
const logger = require("morgan");
const fileUpload=require("express-fileupload");
const mainRoute=require("./routes/main")
const authRouter=require("./routes/auth");
const usersRouter=require("./routes/users");
const categoriesRouter=require("./routes/categories");
const productsRouter=require("./routes/products");
const meProductsRouter=require("./routes/meProducts");
const cartRouter=require("./routes/cart");
const transactionsRouter=require("./routes/transactions");

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
    secret:process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave:true
}));
app.use(cartMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger("dev"));
app.use('/',mainRoute);
app.use('/api/v1/users/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/me/products',meProductsRouter);
app.use('/api/v1/me/cart',cartRouter);
app.use('/api/v1/me/transactions',transactionsRouter);
app.use('/api/v1/doc',swaggerUI.serve,swaggerUI.setup(swaggerJsDoc(swaggerSpec)));
app.listen(port,()=>console.log(`Server is running on the port ${port}`));
module.exports=app;