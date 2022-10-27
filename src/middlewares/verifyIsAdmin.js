const verifyIsAdmin=(req,res,next)=> {
    const {user}=req;
    if (user.role_name!=="Admin") {
        return res.status(403).json({
            status:403,
            message:`${req.user.first_name}, you don't have permission to do it`,
        }) ;
    }
    return next()
}

module.exports=verifyIsAdmin