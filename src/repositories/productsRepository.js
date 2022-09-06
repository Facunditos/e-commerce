const {Product,User}=require("../database/models/index");
const {Op}=require("sequelize")
const productsRepository={
    getAllProducts:async()=>{
        const products=await Product.findAll({
            include:[
                {association:'Seller'},
                {association:'Sales'},
                {association:'Transactions'},
                {association:'Category'}
            ],
        });
        return products
    },
    getAllProductsBySeller:async(seller_user_id)=>{
        const products=await Product.findAll({
            where:{
                seller_user_id
            },
            include:[
                {association:'Seller'},
                {association:'Sales'},
                {association:'Transactions'},
                {association:'Category'}
            ],
        });
        return products
    },
    findProductByPk:async(id)=>{
        const product=await Product.findByPk(id,{
            include:[
                {association:"Seller"},
                {association:'Transactions'},
                {association:'Category'},
            ],
        });
        return product
    },
    createProduct:async(body)=>{
        let product=await Product.create({
            name:body.name,
            description:body.description,
            price:body.price,
            seller_user_id:body.seller_user_id,
            category_id:body.category_id,
            stock:body.stock,
            status:body.status,
            image_url:body.image_url,
            
        });
        product=await Product.findByPk(product.id,{
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
    updateProduct:async(body,id)=>{
        let product=await Product.update({
            name:body.name,
            description:body.description,
            price:body.price,
            category_id:body.category_id,
            stock:body.stock,
            status:body.status,
            image_url:body.image_url,
        },{
            where:{
                id
            }
        });
        product=await Product.findByPk(id,{
            include:[
                {association:'Seller'},
                {association:'Transactions'},
                {association:'Category'},
            ],
        });
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