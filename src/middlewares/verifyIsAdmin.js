const verifyIsAdmin=(req,res,next)=> {
    const {is_admin}=req.user
    if (!is_admin) {
        return res.status(403).json({
            status:403,
            message:`${req.user.first_name}, you don't have permission to do it`,
        }) ;
    }
    return next()
}

module.exports=verifyIsAdmin