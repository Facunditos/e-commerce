const express=require('express');
const router=express.Router();
const {validateRegister,validateLogin}=require("../middlewares/validations/authValidator");

const {registerUser,loginUser}=require('../controllers/authController');
router.post('/register',validateRegister,registerUser);
router.post('/login',validateLogin,loginUser);
module.exports=router
