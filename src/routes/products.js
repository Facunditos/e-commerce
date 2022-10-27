const express=require('express');
const router=express.Router();

const { 
    getProductsList,
    searchProductsByName,
    getProductDetail,
}=require('../controllers/productsController');

router.get('/',getProductsList);
router.get('/search',searchProductsByName);
router.get('/:id',getProductDetail);

module.exports=router
