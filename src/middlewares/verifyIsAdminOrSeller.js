const verifyIsAdminOrSeller=(req,res,next)=> {
    const {user}=req;
    //Se accede al atributo Role.name desde dataValues porque al intentar hacerlo directamente desde user el resultado es "undefined", Role.name es el alias de una subquery agregada en el método findUserByEmail
    if (user.Role.name!=="Admin"&&user.Role.name!=="Seller") {
        return res.status(403).json({
            status:403,
            message:`${req.user.first_name}, you don't have permission to do it`,
        });
    };
    return next();
};
module.exports=verifyIsAdminOrSeller;