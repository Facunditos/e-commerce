const {Product,User}=require("../database/models/index");
const sequelize=require("sequelize");
const {Op}=require("sequelize");

const productsRepository={
    getAllProductsOrderBySales:async(offset,sellerId)=>{
        const oneSeller=sellerId;
        const allSellers={[Op.gte]:0};
        const allStatus=['active','inactive'];
        const products=await Product.findAndCountAll({
            where:{
                seller_user_id:sellerId?oneSeller:allSellers,
                status:sellerId?allStatus:'active',
            },
            attributes:{
                include:[
                    [
                        sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Product.id)'),
                        'sales'
                    ]
                ],
            },
            order:[['sales','DESC']],
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
                [sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Product.id)'), 'sales'],
                [sequelize.literal('(SELECT name FROM Categories WHERE Categories.id = Product.category_id)'), 'category'],
            ],
            order:[sequelize.literal('category'),[sequelize.literal('sales'),'desc']],
            limit:5,
            offset
        });
        return products
    },
    searchProductsByNameAndOrder:async(name,orderBy,order,offset,sellerId)=>{
        if (orderBy===undefined) orderBy='sales';
        if (order===undefined) {
            if (orderBy==='sales') {
                order='desc';
            } else {
                order='asc';
            };
        };
        
        const allSellers={[Op.gte]:0}
        const oneSeller=sellerId;
        const allStatus=['active','inactive'];
        const products=await Product.findAndCountAll({
            where:{
                name:{[Op.like]:`%${name}%`},
                seller_user_id:sellerId?oneSeller:allSellers,
                status:sellerId?allStatus:'active',
            },
            attributes:{
                include:[
                    [
                        sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Product.id)'),
                        'sales'
                    ],
                ],
            },
            order:[[orderBy,order]],
            limit:5,
            offset
        });
        return products;
    },
    findProductByPk:async(id)=>{
        const product=await Product.findByPk(id,{
            attributes:{
                exclude:['category_id','createdAt','updatedAt','deletedAt'],
                include:[
                    [
                        sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Product.id)'),
                        'total sales'
                    ],
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
                    attributes:{
                        exclude:['id','buyer_user_id','worth','deletedAt','updatedAt'],
                        include:[
                            [
                                sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Product.id AND Transaction_Product.transaction_id=Transactions.id)'),
                                'sale'
                            ],
                        ]
                    },
                    include:[
                        {
                            association:'Buyer',
                            attributes:['first_name','last_name','email']
                        }
                    ]
                },
            ]
        });
        return product;
    },
    findProductByName:async(name)=>{
        const product=await Product.findOne({
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
    updateProduct:async(product,body)=>{
        const {
            name,
            description,
            price,
            category_id,
            stock,
            status,
            image
        }=body;
        const update={};
        if (name) update.name=name;
        if (description) update.description=description;
        if (price) update.price=price;
        if (category_id) update.category_id=category_id;
        if (stock || stock===0) update.stock=stock;
        if (status) update.status=status;
        if (image) update.image=image;
        const productUpdated=await product.update(update);
        return productUpdated;
    },
    destroyProduct:async(id)=>{
        return await Product.destroy({
            where:{
                id
            }
        });
    },
    restoreProduct:async(name)=>{
        return await Product.restore({
            where:{
                name
            }
        })
    },
};

module.exports=productsRepository