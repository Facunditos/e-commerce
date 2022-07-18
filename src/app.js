require("dotenv").config();
const express=require('express');
const app=express();

var logger = require("morgan");

const usersRouter=require("./routes/users");
const transactionsRouter=require("./routes/transactions");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(logger("dev"));
app.use("/",express.Router().get("/",(req,res)=>
    {
    res.send('hola mundo divino, que tal te estás sintiendo en tu nueva casa, la verdad es que quiero que tu estadía la disfrutes como realmente te lo merecés. Te cosquilleo a lot')
    }
))
app.use('/users', usersRouter);
app.use('/transactions',transactionsRouter);

const port=process.env.PORT||3030;
app.listen(port,()=>console.log(`Server is running on the port ${port}`));

module.exports=app