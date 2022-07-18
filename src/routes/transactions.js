const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateTransaction}=require("../middlewares/transactionsValidator");

const {
    getTransactionsList,
    getTransactionDetail,
    createTransaction,
    updateTransaction,
    deleteTransaction
}=require('../controllers/transactionsController');



router.get('/',verifyToken,getTransactionsList);
router.get('/:id',verifyToken,getTransactionDetail);
router.post('/',verifyToken,validateTransaction,createTransaction);
router.put('/:id',verifyToken,validateTransaction,updateTransaction);
router.delete("/:id",verifyToken,deleteTransaction);

module.exports=router
