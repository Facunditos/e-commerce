const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const isBuyer=require("../middlewares/isBuyer");
const {validateTransaction}=require("../middlewares/transactionsValidator");

const {
    getCart,
    buyCart,
    addToCart,
    setQuantity,
    increaseQuantity,
    decreseQuantity,
    removeFromCart
}=require('../controllers/cartController');



router.get('/',verifyToken,isBuyer,getCart);
router.post('/buy',verifyToken,buyCart);
router.post('/:id',verifyToken,isBuyer,addToCart);
router.put('/:id',verifyToken,isBuyer,setQuantity);
router.put('/:id/increse',verifyToken,increaseQuantity);
router.put('/:id/decrese',verifyToken,decreseQuantity);
router.delete("/:id",verifyToken,removeFromCart);

module.exports=router
