const { body } = require("express-validator");
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
    getAllTransactionByBuyer:async(buyer_user_id)=>{
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
        const transaction=await Transaction.create({
            buyer_user_id:body.buyer_user_id,
        });
        return transaction
    },
    updateTransaction:async(id,body)=>{
        const transaction=await Transaction.create({
            where:{
                id
            }
        },{
            buyer_user_id:body.buyer_user_id,
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
}

module.exports=transactionsRepository