const {TransactionProduct}=require("../database/models/index");

const transactions_productsRepository={
    getAllTransactionsDetails:async()=>{
        const transactionsDetails=await TransactionProduct.findAll({
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionsDetails
    },
    findTransactionDetailByPk:async (id)=>{
        const transactionDetail= await TransactionProduct.findByPk(id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        })
        return transactionDetail
    },
    findTransactionDetailsByTransaction:async(transaction_id)=>{
        const transactionDetails=await TransactionProduct.findAll({
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
    createTransactionDetail :async(body)=>{
        await TransactionProduct.create({
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            stock:product.stock
        });
        const transactionDetail=await TransactionProduct.findByPk(transactionDetail.id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionDetail
    },
    updateTransactionDetail :async(id,body)=>{
        let transactionDetail=await TransactionProduct.update({
            where:{
                id
            }
        },{
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            stock:product.stock
        });
        transactionDetail=await TransactionProduct.findByPk(transactionDetail.id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionDetail
    },
    destroyTransactionDetail:async(id)=>{
        return await TransactionProduct.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=transactions_productsRepository