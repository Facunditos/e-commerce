const {User}=require("../database/models/index");

const usersRepository={
    getAllUsers:async()=>{
        const users=await User.findAll({
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
            ],
        });
        return users
    },
    findUserByPk:async(id)=>{
        const user=await User.findByPk(id,{
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
            ],
        });
        return user
    },
    findUserByEmail:async(email)=>{
        const user=await User.findOne({
            where:{
                email
            },
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
            ],
        });
        return user
    },
    findUserByType:async(type)=>{
        //falta desarrollar este apartado, debería incluirse únicamente a aquellos usuarios que hayan efectuados transacciones
        if (type=buyer) {
           const users=await User.findAll({
                include:[{association:'Buys'}],
            })
            return users
        }
    },
    createUser:async(body)=>{
        const user=await User.create({
            last_name:body.first_name,
            first_name:body.first_name,
            email:body.email,
            password:body.password,
            is_admin:body.is_admin,
        });
        return user
    },
    updateUser:async(body,id)=>{
        await User.update({
            first_name:body.first_name,
            last_name:body.last_name,
            email:body.email,
            password:body.password,
            is_admin:body.is_admin,
        },{
            where:{
                id
            }
        });
        const user=await User.findByPk(id);
        return user
    },
    destroyUser:async(id)=>{
        return await User.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=usersRepository