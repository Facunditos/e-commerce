const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsSeller=require("../middlewares/verifyIsSeller");

const {
    getSalesList,
    getSaleDetail,
}=require('../controllers/salesController');

router.get('/',verifyToken,verifyIsSeller,getSalesList);
router.get('/:id',verifyToken,verifyIsSeller,getSaleDetail);
module.exports=router;
