const verifyIsAdminOrBuyer=(req,res,next)=> {
    const {user}=req;
    if (user.Role.name!=="Admin"&&user.Role.name!=="Buyer") {
        return res.status(403).json({
            status:403,
            message:`${req.user.first_name}, you don't have permission to do it`,
        });
    };
    return next()
}

module.exports=verifyIsAdminOrBuyer;