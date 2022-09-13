const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsSeller=require("../middlewares/verifyIsSeller");
const {validateCreate,validateUpdate}=require("../middlewares/productsValidator");


const { 
    getProductsList,
    searchProductsByName,
    getProductDetail,
    createProduct,
    updateProduct,
    deleteProduct
}=require('../controllers/productsController');



router.get('/',verifyToken,getProductsList);
router.get('/search/name',searchProductsByName);
router.get('/search/category',verifyToken,verifyIsSeller,searchProductsByCategory);
router.get('/:id',getProductDetail);
router.post('/',verifyToken,verifyIsSeller,validateCreate,createProduct);
router.put('/:id',verifyToken,verifyIsSeller,validateUpdate,updateProduct);
router.delete('/:id',verifyToken,verifyIsSeller,deleteProduct);

module.exports=router
