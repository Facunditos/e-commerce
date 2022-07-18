const {Transaction_Detail}=require("../database/models/index");

const transactions_productsRepository={
    getAllTransactionsDetails:async()=>{
        const transactionsDetails=await Transaction_Detail.findAll({
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionsDetails
    },
    findDetailsByTransaction:async(transaction_id)=>{
        const transactionDetails=await Transaction_Detail.findAll({
            where:{
                transaction_id
            },
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionDetails
    },
    createTransactionDetails :async(body)=>{
        const transactionDetails=await Transaction_Detail.create({
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            quantity:product.quantity
        });
        return transactionDetails
    },
    updateTransactionDetails :async(id,body)=>{
        const transactionDetails=await Transaction_Detail.update({
            where:{
                id
            }
        },{
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            quantity:product.quantity
        });
        return transactionDetails
    },
    destroyTransactionDetails:async(id)=>{
        return await Transaction_Detail.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=transactions_productsRepository