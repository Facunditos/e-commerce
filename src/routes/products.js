const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdminOrSeller=require("../middlewares/verifyIsAdminOrSeller");
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



router.get('/',verifyToken,verifyIsAdminOrSeller,getProductsList);
router.get('/search',verifyToken,verifyIsAdminOrSeller,searchProductsByName);
router.get('/:id',verifyToken,verifyIsAdminOrSeller,getProductDetail);
router.post('/',verifyToken,verifyIsSeller,validateCreate,createProduct);
router.put('/:id',verifyToken,verifyIsSeller,validateUpdate,updateProduct);
router.delete('/:id',verifyToken,verifyIsSeller,deleteProduct);




module.exports=router
