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
    findTransactionDetailByPk:async (id)=>{
        const transactionDetail= await Transaction_Detail.findByPk(id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        })
        return transactionDetail
    },
    findTransactionDetailsByTransaction:async(transaction_id)=>{
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
    createTransactionDetail :async(body)=>{
        await Transaction_Detail.create({
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            quantity:product.quantity
        });
        const transactionDetail=await Transaction_Detail.findByPk(transactionDetail.id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionDetail
    },
    updateTransactionDetail :async(id,body)=>{
        let transactionDetail=await Transaction_Detail.update({
            where:{
                id
            }
        },{
            transaction_id:body.transaction_id,
            product_id:body.product_id,
            quantity:product.quantity
        });
        transactionDetail=await Transaction_Detail.findByPk(transactionDetail.id,{
            include:[
                {association:'Transaction',},
                {association:'Product',},
            ],
        });
        return transactionDetail
    },
    destroyTransactionDetail:async(id)=>{
        return await Transaction_Detail.destroy({
            where:{
                id
            }
        });
    },
}

module.exports=transactions_productsRepository