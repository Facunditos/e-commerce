const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateCreate,validateUpdate}=require("../middlewares/categoriesValidator");


const { 
    getCategoriesList,
    searchCategoriesByName,
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory
}=require('../controllers/categoriesController');



router.get('/',verifyToken,verifyIsAdmin,getCategoriesList);
router.get('/search',verifyToken,verifyIsAdmin,searchCategoriesByName);
router.get('/:id',verifyToken,verifyIsAdmin,getCategoryDetail);
router.post('/',verifyToken,verifyIsAdmin,validateCreate,createCategory);
router.put('/:id',verifyToken,validateUpdate,updateCategory);
router.delete('/:id',verifyToken,deleteCategory);

module.exports=router
