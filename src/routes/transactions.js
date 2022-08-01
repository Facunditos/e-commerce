const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateTransaction}=require("../middlewares/transactionsValidator");

const {
    getTransactionsList,
    getTransactionDetail,
    deleteTransaction
}=require('../controllers/transactionsController');



router.get('/',verifyToken,getTransactionsList);
router.get('/:id',verifyToken,getTransactionDetail);
router.delete("/:id",verifyToken,deleteTransaction);

module.exports=router
