const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateCreate,validateUpdate}=require("../middlewares/validations/categoriesValidator");


const { 
    getCategoriesList,
    searchCategoriesByName,
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory
}=require('../controllers/categoriesController');
router.get('/',getCategoriesList);
router.get('/search',searchCategoriesByName);
router.get('/:id',getCategoryDetail);
router.post('/',verifyToken,verifyIsAdmin,validateCreate,createCategory);
router.put('/:id',verifyToken,verifyIsAdmin,validateUpdate,updateCategory);
router.delete('/:id',verifyToken,verifyIsAdmin,deleteCategory);
module.exports=router;
