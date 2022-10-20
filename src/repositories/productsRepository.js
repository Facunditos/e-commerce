const {Product,User}=require("../database/models/index");
const sequelize=require("sequelize");
const {Op}=require("sequelize");

const productsRepository={
    getAllProductsOrderByCategoryAndSales:async(offset,sellerId)=>{
        const allSellers={[Op.gte]:0}
        const oneSeller=sellerId;
        const products=await Product.findAndCountAll({
            where:{
                seller_user_id:sellerId?oneSeller:allSellers
            },
            attributes:[
                "id",
                "name",
                "price",
                'image',
                [sequelize.literal('(SELECT sum(quantity*price) FROM transaction_product WHERE transaction_product.product_id = Product.id)'), 'sales'],
                [sequelize.literal('(SELECT name FROM categories WHERE categories.id = Product.category_id)'), 'category'],
            ],
            order:[sequelize.literal('category'),[sequelize.literal('sales'),'desc']],
            limit:5,
            offset
        });
        return products
    },
    getAllProductsBySellerOrderByCategoryAndSales:async(offset,seller_user_id)=>{
        const products=await Product.findAndCountAll({
            where:{
                seller_user_id
            },
            attributes:[
                "id",
                "name",
                "price",
                'image',
                [sequelize.literal('(SELECT sum(quantity*price) FROM transaction_product WHERE transaction_product.product_id = Product.id)'), 'sales'],
                [sequelize.literal('(SELECT name FROM categories WHERE categories.id = Product.category_id)'), 'category'],
            ],
            order:[sequelize.literal('category'),[sequelize.literal('sales'),'desc']],
            limit:5,
            offset
        });
        return products
    },
    searchProductsByNameAndOrder:async(name,orderByAttribute,direction,offset,sellerId)=>{
        if (orderByAttribute==undefined) orderByAttribute='name';
        if (direction==undefined) direction='asc';
        const allSellers={[Op.gte]:0}
        const oneSeller=sellerId;
        const products=await Product.findAndCountAll({
            where:{
                name:{[Op.like]:`%${name}%`},
                seller_user_id:sellerId?oneSeller:allSellers
            },
            attributes:[
                "id",
                "name",
                "price",
                'image',
                [sequelize.literal('(SELECT sum(quantity*price) FROM transaction_product WHERE transaction_product.product_id = Product.id)'), 'total sales'],
                [sequelize.literal('(SELECT name FROM categories WHERE categories.id = Product.category_id)'), 'category'],
            ],
            order:[[orderByAttribute,direction]],
            limit:5,
            offset
            
        });
        return products
    },
    findProductByPk:async(id)=>{
        const product=await Product.findByPk(id,{
            attributes:{
                exclude:['category_id','createdAt','updatedAt','deletedAt'],
                include:[
                    [sequelize.literal('(SELECT sum(quantity*price) FROM transaction_product WHERE transaction_product.product_id = Product.id)'),'sales'],
                ]               
            },
            include:[
                {
                    association:'Category',
                    attributes:['name']
                },
                {
                    association:'Seller',
                    attributes:['first_name','last_name','email']
                },
                {
                    association:'Transactions',
                    attributes:[
                        ['createdAt','sale date'],
                        [sequelize.literal('(SELECT sum(quantity*price) FROM transaction_product WHERE transaction_product.product_id = Product.id AND transaction_product.transaction_id=transactions.id)'),'sales']
                    ],
                    include:[
                        {
                            association:'Buyer',
                            attributes:['first_name','last_name','email']
                        }
                    ]
                },

            ]
        });
        return product
    },
    findProductByName:async(name)=>{
        const product=await Product.findOne({
            attributes:['name'],
            where:{
                name
            }
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
            image:body.image,
            
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
            image:body.image,
        },{
            where:{
                id
            }
        });
        product=await Product.findByPk(id);
        return product
    },
    destroyProduct:async(id)=>{
        return await Product.destroy({
            where:{
                id
            }
        });
    },
};

module.exports=productsRepository