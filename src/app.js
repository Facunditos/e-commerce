require("dotenv").config();
const path=require("path");
const express=require('express');
const session = require("express-session");
const logger = require("morgan");
const fileUpload=require("express-fileupload");
const mainRouter=require("./routes/main");
const authRouter=require("./routes/auth");
const usersRouter=require("./routes/users");
const categoriesRouter=require("./routes/categories");
const cartRouter=require("./routes/cart");
const transactionsRouter=require("./routes/transactions");
const productsRouter=require("./routes/products");
const cartMiddleware=require("../src/middlewares/cartMiddleware");
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
app.use('/', mainRouter);
app.use('/users/auth', authRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/me/cart',cartRouter);
app.use('/me/transactions',transactionsRouter);
app.use('/products',productsRouter);


app.listen(port,()=>console.log(`Server is running on the port ${port}`));

module.exports=app