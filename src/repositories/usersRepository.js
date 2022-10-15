const {User}=require("../database/models/index");
const {Op}=require('sequelize')

const usersRepository={
    getAllUsers:async()=>{
        const users=await User.findAll({
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
                {association:'Role'}

            ],
        });
        return users
    },
    findUserByPk:async(id)=>{
        const user=await User.findByPk(id,{
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
                {association:'Role'}

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
                {association:'Role'}

            ],
        });
        return user
    },
    searchUsersByEmail:async(email)=>{
        const users=await User.findAll({
            where:{
                email:{[Op.like]:`%${email}%`}
            },
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
                {association:'Role'}

            ],
        });
        return users
    },
    createUser:async(body)=>{
        let user=await User.create({
            first_name:body.first_name,
            last_name:body.last_name,
            email:body.email,
            password:body.password,
            role_id:body.role_id,
            edad:body.edad,
            image:body.image
        });
        user=await User.findByPk(user.id,{
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
                {association:'Role'}

            ],
        });
        return user;
    },
    updateUser:async(body,id)=>{
        await User.update({
            first_name:body.first_name,
            last_name:body.last_name,
            email:body.email,
            password:body.password,
            image:body.image
        },{
            where:{
                id
            }
        });
        const user=await User.findByPk(id,{
            include:[
                {association:'Buys'},
                {association:'ProductsOnSale'},
                {association:'Role'}

            ],
        });
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