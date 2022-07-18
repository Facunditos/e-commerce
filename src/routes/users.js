const express=require('express');
const router=express.Router();
const verifyToken=require("../middlewares/verifyToken")
const verifyIsAdmin=require("../middlewares/verifyIsAdmin")
const {validateRegister,validateLogin,validateUpdate}=require("../middlewares/usersValidator")

const {
    getUsersList,
    getUserDetail,
    searchUserByType,
    registerUser,
    loginUser,
    updateUser,
    deleteUser
}=require('../controllers/usersController');



router.get('/',verifyToken,verifyIsAdmin,getUsersList);
router.get('/:id',verifyToken,verifyIsAdmin,getUserDetail);
router.get('/search',verifyToken,verifyIsAdmin,searchUserByType);
router.post('/',validateRegister,registerUser);
router.post('/login',validateLogin,loginUser);
router.put('/:id',verifyToken,validateUpdate,updateUser);
router.delete("/:id",verifyToken,deleteUser);

module.exports=router
