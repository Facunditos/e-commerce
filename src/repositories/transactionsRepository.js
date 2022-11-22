const {Transaction}=require("../database/models/index");
const sequelize=require("sequelize");
const transactionsRepository={
    getAllTransactions:async(offset)=>{
        const transactions=await Transaction.findAndCountAll({
            attributes:["id","worth",["createdAt","purchase date"]],
            order:[['createdAt','DESC']],
            limit:5,
            offset
        });
        return transactions
    },
    getAllTransactionsByBuyer:async(buyer_user_id,offset)=>{
        const transactions=await Transaction.findAndCountAll({
            where:{
                buyer_user_id
            },
            attributes:["id","worth",["createdAt","purchase date"]],
            order:[['createdAt','DESC']],
            limit:5,
            offset
        });
        return transactions
    },
    findTransactionByPk:async(id)=>{
        const transaction=await Transaction.findByPk(id,{
            attributes:['id','buyer_user_id','worth','createdAt'],
            include:[
                {
                    association:'Buyer',
                    attributes:['first_name','last_name','email'],
                },
                {
                    association:'Products',
                    attributes:{
                        include:[
                            [
                                sequelize.literal('(SELECT sum(quantity*price) FROM Transaction_Product WHERE Transaction_Product.product_id = Products.id AND Transaction_Product.transaction_id=Transaction.id)'),
                                'subtotal'
                            ],
                        ],
                        exclude:['price','description','seller_user_id','category_id','stock','status','image','createdAt','updatedAt','deletedAt']
                    },
                    include:[
                        {
                            association:"Seller",
                            attributes:['first_name','last_name','email'],
                        },
                        {
                            association:"Category",
                            attributes:['name'],
                        },
                    ]
                },
            ],
        });
        return transaction
    },
    createTransaction:async(body)=>{
        let transaction=await Transaction.create({
            buyer_user_id:body.buyer_user_id,
            worth:body.cartWorth,
        });
        return transaction
    },
    updateTransaction:async(id,body)=>{
        await Transaction.create({
            where:{
                id
            }
        },{
            buyer_user_id:body.buyer_user_id,
        });
        const transaction=await Transaction.findByPk(transaction.id,{
            include:[
                {association:'Buyer'},
                {association:'Products'},
            ],
        });
        return transaction
    },
    destroyTransaction:async(id)=>{
        return await Transaction.destroy({
            where:{
                id
            }
        });
    },
    transactionAddProduct:async(transaction,product)=>{
        return await transaction.addProduct(product.id,{
            through:{
                price:product.price,
                quantity:product.quantity
            }
        });
    }
}

module.exports=transactionsRepository