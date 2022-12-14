require("dotenv").config()
const jwt=require("jsonwebtoken")
const {findUserByPk}=require("../repositories/usersRepository");
const verifyToken=(req,res,next)=> {
    const {token}=req.headers;
    jwt.verify(token,process.env.JWT_PRIVATE_KEY,async(error,resolve)=>{
        if (error) {
            return res.status(401).json({
                status:401,
                message:'There is a problem with user authentication',
                detail:error.message
            }) ;
        };
        const userId=resolve.payload;
        const user=await findUserByPk(userId);
        req.user=user;
        return next()
        }
    )
};

module.exports=verifyToken