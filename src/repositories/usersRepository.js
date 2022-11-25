const {User, sequelize, Sequelize}=require("../database/models/index");
const {Op}=require('sequelize')

const usersRepository={
    getAllUsers:async(offset)=>{
        const users=await User.findAndCountAll({
            attributes:{
                exclude:['password']
            },
            offset,
            limit:5
        });
        return users
    },
    findUserByPk:async(id)=>{
        const user=await User.findByPk(id,{
            attributes:['id','first_name','last_name','email','image'],
            include:[
                {
                    association:'Buys',
                    attributes:[
                        'id',
                        'worth',
                        'createdAt'
                    ]
                },
                {
                    association:'ProductsOnSale',
                    attributes:[
                        'id',
                        'name',
                    ],
                },
                {
                    association:'Role',
                    attributes:['name']
                }
            ],
        });
        return user
    },
    findUserByEmail:async(email)=>{
        const user=await User.findOne({
            where:{
                email
            },
            attributes:{
                include:[
                    [
                        Sequelize.literal('(select name from Roles where Roles.id=User.role_id)'),
                        'role_name'
                    ],
                ],
            },
        });
        return user;
    },
    searchUsersByEmail:async(email,offset)=>{
        const users=await User.findAndCountAll({
            where:{
                email:{[Op.like]:`%${email}%`}
            },
            limit:5,
            offset
        });
        return users;
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
        return user;
    },
    updateUser:async(user,body)=>{
        const {
            first_name,
            last_name,
            email,
            password,
            image
        }=body;
        const update={};
        if (first_name) update.first_name=first_name;
        if (last_name) update.last_name=last_name;
        if (email) update.email=email;
        if (password) update.password=password;
        if (image) update.image=image;
        const userUpdated=await user.update(update);
        return userUpdated;
    },
    destroyUser:async(id)=>{
        return await User.destroy({
            where:{
                id
            }
        });
    },
    restoreUser:async(email)=>{
        return await User.restore({
            where:{
                email
            }
        })
    },
}

module.exports=usersRepository