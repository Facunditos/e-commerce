const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsBuyer=require("../middlewares/verifyIsBuyer");
const validateSetQuantity=require("../middlewares/cartValidator");

const {
    getCart,
    buyCart,
    addToCart,
    setQuantity,
    increaseQuantity,
    decreseQuantity,
    removeFromCart,
    emptyCart
}=require('../controllers/cartController');



router.get('/',verifyToken,getCart);
router.post('/buy',verifyToken,buyCart);
router.post('/:id',verifyToken,verifyIsBuyer,addToCart);
router.put('/:id',verifyToken,verifyIsBuyer,validateSetQuantity,setQuantity);
router.put('/:id/increase',verifyToken,verifyIsBuyer,increaseQuantity);
router.put('/:id/decrease',verifyToken,verifyIsBuyer,decreseQuantity);
router.delete("/:id",verifyToken,verifyIsBuyer,removeFromCart);
router.delete("/",verifyToken,verifyIsBuyer,emptyCart);

module.exports=router
