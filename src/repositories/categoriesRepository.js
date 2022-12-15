const {Category}=require("../database/models/index");
const {Op}=require("sequelize")

const categoriesRepository={
    getAllCategories:async(offset)=>{
        const categories=await Category.findAndCountAll({
            limit:5,
            offset
        });
        return categories
    },
    searchCategoriesByName:async(name,offset)=>{
        const categories=await Category.findAndCountAll({
            where:{
                name:{[Op.like]:`%${name}%`}
            },
            limit:5,
            offset
        });
        return categories
    },
    findCategoryByPk:async(id)=>{
        const category=await Category.findByPk(id,{
            attributes:[
                'id',
                'name',
                'description',
            ],
            include:[
                {
                    association:'Products',
                    required:false,
                    where:{
                        status:'active',
                    },
                    attributes:[
                        'id',
                        'name',
                        'description',
                        'price',
                        'image'
                    ],
                    include:[
                        {
                            association:'Seller',
                            attributes:[
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'image',
                            ],
                        },
                    ],
                },
            ],
        });
        return category
    },
    findCategoryByName:async(name)=>{
        const category=await Category.findOne({
            where:{
                name
            },
        });
        return category
    },
    createCategory:async(body)=>{
        let category=await Category.create({
            name:body.name,
            description:body.description,
        });
        return category
    },
    updateCategory:async(category,body)=>{
        const {name,description}=body;
        const update={};
        if (name) update.name=name;
        if (description) update.description=description;
        const categoryUpdated=await category.update(update);
        return categoryUpdated
    },
    destroyCategory:async(id)=>{
        return await Category.destroy({
            where:{
                id
            }
        });
    },
    restoreCategory:async(name)=>{
        return await Category.restore({
            where:{
                name
            }
        })
    },
}

module.exports=categoriesRepository