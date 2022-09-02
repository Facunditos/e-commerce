const {Transaction}=require("../database/models/index");

const transactionsRepository={
    getAllTransactions:async()=>{
        const transactions=await Transaction.findAll({
            include:[
                {association:'Buyer'},
                {association:'Products'},
                {association:'Details'},
            ],
        });
        return transactions
    },
    getAllTransactionsByBuyer:async(buyer_user_id)=>{
        const transactions=await Transaction.findAll({
            where:{
                buyer_user_id
            },
            include:[
                {association:'Buyer'},
                {association:'Products'},
                {association:'Details'},
            ],
        });
        return transactions
    },
    findTransactionByPk:async(id)=>{
        const transaction=await Transaction.findByPk(id,{
            include:[
                {association:'Buyer'},
                {association:'Details'},
                {association:'Products'},
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
                {association:'Details'},
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
                {association:'Details'},
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