const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const isBuyer=require("../middlewares/isBuyer");
const validateSetQuantity=require("../middlewares/cartValidator");

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
router.put('/:id',verifyToken,isBuyer,validateSetQuantity,setQuantity);
router.put('/:id/increase',verifyToken,isBuyer,increaseQuantity);
router.put('/:id/decrease',verifyToken,isBuyer,decreseQuantity);
router.delete("/:id",verifyToken,isBuyer,removeFromCart);

module.exports=router
