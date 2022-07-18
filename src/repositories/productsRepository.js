const {Product}=require("../database/models/index");

const productsRepository={
    getAllProducts:async()=>{
        const products=await Product.findAll({
            include:[
                {association:'Seller'},
                {association:'Sales'},
                {association:'Transactions'},
                {association:'Category'},
                ,
            ],
        });
        return products
    },
    findProductByPk:async(id)=>{
        const product=await Product.findByPk(id,{
            include:[
                {association:'Seller'},
                {association:'Sales'},
                {association:'Transactions'},
                {association:'Category'},
                ,
            ],
        });
        return product
    },
    createProduct:async(body)=>{
        const product=await Product.create({
            name:body.name,
            description:body.description,
            quantity:body.quantity,
            status:body.status,
            seller_user_id:body.seller_user_id,
        });
        return product
    },
    updateProduct:async(body,id)=>{
        await Product.update({
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
        const product=await Product.findByPk(id);
        return product
    },
    destroyProduct:async(id)=>{
        return await Product.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=productsRepository