const {Category}=require("../database/models/index");
const {Op}=require("sequelize")

const categoriesRepository={
    getAllCategories:async()=>{
        const categories=await Category.findAll({
            include:[
                {association:'Products'},
            ],
        });
        return categories
    },
    searchCategoriesByName:async(name)=>{
        const categories=await Category.findAll({
            where:{
                name:{[Op.like]:`%${name}%`}
            },
            include:[
                {association:'Products'},
            ],
        });
        return categories
    },
    findCategoryByPk:async(id)=>{
        const category=await Category.findByPk(id,{
            include:[
                {association:'Products'},
            ],
        });
        return category
    },
    findCategoryByName:async(name)=>{
        const category=await Category.findOne({
            where:{
                name
            },
            include:[
                {association:'Products'},
            ],
        });
        return category
    },
    findCategoryByName:async(name)=>{
        const category=await Category.findOne({
            where:{
                name
            },
            include:[
                {association:'Products'},
            ],
        });
        return category
    },
    createCategory:async(body)=>{
        let category=await Category.create({
            name:body.name,
            description:body.description,
        });
        category=await Category.findByPk(category.id,{
            include:[
                {association:'Products'},
            ],
        });
        return category
    },
    updateCategory:async(body,id)=>{
        await Category.update({
            name:body.name,
            description:body.description,
        },{
            where:{
                id
            }
        });
        const category=await Category.findByPk(id,{
            include:[
                {association:'Products'},
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