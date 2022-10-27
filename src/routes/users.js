const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken");
const verifyIsAdmin=require("../middlewares/verifyIsAdmin");
const {validateUpdate}=require("../middlewares/validations/usersValidator");

const {
    getUsersList,
    getUserDetail,
    searchUsersByEmail,
    updateUser,
    deleteUser,
}=require('../controllers/usersController');



router.get('/',verifyToken,verifyIsAdmin,getUsersList);
router.get('/search',verifyToken,verifyIsAdmin,searchUsersByEmail);
router.get('/:id',verifyToken,getUserDetail);
router.put('/:id',verifyToken,validateUpdate,updateUser);
router.delete('/:id',verifyToken,deleteUser);

module.exports=router;
