require("dotenv").config()
const jwt=require("jsonwebtoken")

const verifyToken=(req,res,next)=> {
    const {token}=req.headers
    jwt.verify(token,process.env.SECRETORPRIVATEKEY,(error,resolve)=>{
        if (error) {
            return res.status(401).json({
                status:401,
                message:'There is a problem with user authentication',
                detail:error.message
            }) ;
        };
        req.user=resolve.payload;
        const array=token.split("");
        const arrayLimpio=[]
        array.map(caracter=>{
            if (caracter!="-" && caracter!=".")
            arrayLimpio.push(caracter);

        });
        const string=arrayLimpio.join("");
        req.user.token=string;
        return next()
        }
    )
};

module.exports=verifyToken