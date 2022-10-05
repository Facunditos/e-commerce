const express=require('express');
const router=express.Router();

const { 
    getProductsList,
    searchProductsByName,
    getProductDetail,
}=require('../controllers/shopController');

router.get('/',getProductsList);
router.get('/search',searchProductsByName);
router.get('/:id',getProductDetail);

module.exports=router
