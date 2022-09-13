const {Transaction}=require("../database/models/index");

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
    getAllTransactionsByBuyer:async(buyer_user_id)=>{
        const transactions=await Transaction.findAndCountAll({
            where:{
                buyer_user_id
            },
            attributes:["id","worth",["createdAt","purchase date"]],
            order:[['createdAt','DESC']],
        });
        return transactions
    },
    findTransactionByPk:async(id)=>{
        const transaction=await Transaction.findByPk(id,{
            attributes:['worth','createdAt'],
            include:[
                {
                    association:'Buyer',
                    attributes:['first_name','last_name','email'],
                },
                {
                    association:'Products',
                    attributes:['id','price','name'],
                    include:[
                        {
                            association:"Seller",
                            attributes:['first_name','last_name','email'],
                        },
                        {
                            association:"Category",
                            attributes:['name'],
                        }
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
        transaction=await Transaction.findByPk(transaction.id,{
            include:[
                {association:'Buyer'},
                {association:'Products'},
            ],
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