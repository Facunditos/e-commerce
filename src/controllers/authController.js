require("dotenv").config();

const uploadToBucket=require("../services/AWS_S3");
const {
    getAllCategories,
    findCategoryByPk,
    createCategory,
    updateCategory,
    destroyCategory
}=require("../repositories/categoriesRepository");

const {
    getAllProducts,
    findProductByPk,
    createProduct,
    updateProduct,
    destroyProduct
}=require("../repositories/productsRepository");

const {
    getAllTransactionsDetails,
    findTransactionDetailByPk,
    findTransactionDetailsByTransaction,
    createTransactionDetail,
    updateTransactionDetail,
    destroyTransactionDetail
}=require("../repositories/transactionDetailsRepository");

const {
    getAllTransactions,
    getAllTransactionsByBuyer,
    findTransactionByPk,
    createTransaction,
    updateTransaction,
    destroyTransaction
}=require("../repositories/transactionsRepository");

const {
    getAllUsers,
    findUserByPk,
    findUserByEmail,
    findUsersByType,
    createUser,
    updateUser,
    destroyUser
}=require("../repositories/usersRepository");

const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const path=require("path")

const authController={
    registerUser:async(req,res)=>{
        let {body}=req;
        const {file}=req.files;
        const bucket="ecommerce1287/user-img";
        const key=`user-${Date.now()}${path.extname(file.name)}`;
        body.password=bcryptjs.hashSync(body.password,10);
        if (file) body.image_url=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/user-img/${key}`;
        const adminUsers=["e_commerce@gmail.com","facundolopezcrespo@hotmail.com"];
        try {
            await uploadToBucket(bucket,key,file);
            if (adminUsers.includes(body.email)) body.is_admin=true;
            const user=await createUser(body);
            res.status(201).json({
                status:201,
                message:'User created',
                user
            });
            
        } catch(error) {
            console.log(error)
            res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        }
    },
    loginUser:async(req,res)=>{
        console.log(req.session.cart);
        try {
            let {email,password}=req.body;
            let user=await findUserByEmail(email);
            if (!user) {
                return res.status(400).json({
                    status:400,
                    message:'There is no user whit this email. You have to register'
                });
            };
            const hashPassword=user.password;
            let isRightPassword=bcryptjs.compareSync(password,hashPassword);
            if (!isRightPassword) {
                return res.status(400).json({
                    status:400,
                    message:'There is an error in the password. Try it again'
                })
            };
            
            const payload=user;
            const token=jwt.sign(
                {payload},
                process.env.SECRETORPRIVATEKEY,
                {
                  expiresIn: "4h",
                },
            );
            res.status(200).json({
                status:200,
                message:'User logged',
                token
            })
        } catch(error) {
            console.log(error)
            res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
};

module.exports=authController