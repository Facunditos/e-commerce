const {Category}=require("../database/models/index");

const categoriesRepository={
    getAllCategories:async()=>{
        const categories=await Category.findAll({
            include:[
                {association:'Products'},
                ,
            ],
        });
        return categories
    },
    findCategoryByPk:async(id)=>{
        const category=await Category.findByPk(id,{
            include:[
                {association:'Products'},
                ,
            ],
        });
        return category
    },
    createCategory:async(body)=>{
        let category=await Category.create({
            name:body.name,
            description:body.description,
            quantity:body.quantity,
            status:body.status,
            seller_user_id:body.seller_user_id,
        });
        category=await Category.findByPk(category.id,{
            include:[
                {association:'Products'},
                ,
            ],
        });
        return category
    },
    updateCategory:async(body,id)=>{
        let category=await Category.update({
            name:body.name,
            description:body.description,
            quantity:body.quantity,
            status:body.status,
            seller_user_id:body.seller_user_id,
        },{
            where:{
                id
            }
        });
        category=await Category.findByPk(category.id,{
            include:[
                {association:'Products'},
                ,
            ],
        });
        return category
    },
    destroyCategory:async(id)=>{
        return await Category.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=categoriesRepository