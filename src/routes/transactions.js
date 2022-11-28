const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdminOrBuyer=require("../middlewares/verifyIsAdminOrBuyer");
const verifyIsBuyer = require('../middlewares/verifyIsBuyer');
const {
    getTransactionsList,
    getTransactionDetail,
    deleteTransaction
}=require('../controllers/transactionsController');


router.get('/',verifyToken,verifyIsAdminOrBuyer,getTransactionsList);
router.get('/:id',verifyToken,verifyIsAdminOrBuyer,getTransactionDetail);
router.delete("/:id",verifyToken,verifyIsBuyer,deleteTransaction);

module.exports=router;
