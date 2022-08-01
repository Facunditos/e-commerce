const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateTransaction}=require("../middlewares/transactionsValidator");

const {
    getCart,
    buyCart,
    addToCart,
    removeToCart
}=require('../controllers/cartController');



router.get('/',verifyToken,getCart);
router.post('/buy',verifyToken,buyCart);
router.post('/:id',verifyToken,addToCart);
router.delete("/:id",verifyToken,removeToCart);

module.exports=router
