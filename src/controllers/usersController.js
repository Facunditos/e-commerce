require("dotenv").config()
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

const usersController={
    getUsersList:async(req,res)=>{
        try{
            let users = await getAllUsers();
            if (users.length!=0) {
                return res.status(200).json({
                    status:200,
                    users
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no user'
                }) 
            }
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    getUserDetail:async (req,res)=>{
        let {id}=req.params;
        try {
            let user=await findUserByPk(id);
            if (!user) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            return res.status(200).json({
            status:200,
            user
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    searchUserByType:async(req,res)=>{
        try {
            const {type}=req.query;
            const users=await findUsersByType(email);
            if (users!=0) {
                return res.status(200).json({
                    status:200,
                    users
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no user'
                }) 
            }
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    registerUser:async(req,res)=>{
        try {
            let {body}=req;
            body.password=bcryptjs.hashSync(body.password,10);
            const adminUsers=["e_commerce@gmail.com","facundolopezcrespo@hotmail.com"]
            if (adminUsers.includes(body.email)) body.is_admin=true;
            let user=await createUser(body);
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
    updateUser:async(req,res)=>{
        let {id}=req.params;
        let {body}=req;
        try {
            let user=await findUserByPk(id);
            if (!user) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            body.password=bcryptjs.hashSync(body.password,10);
            const userUpdated=await updateUser(body,id)
            return res.status(200).json({
            status:200,
            message:'User updated',
            userUpdated
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    deleteUser:async(req,res)=>{
        let {id}=req.params;
        try {
            let user=await findUserByPk(id);
            if (!user) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            const userTransactions=await user.getBuys();
            const userProducts=await user.getProductsOnSale();
            if (userTransactions.length==0 && userProducts.length==0) {
                await destroyUser(id)
                return res.status(200).json({
                status:200,
                message:'User deleted'
                });  
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There is at least a transaction or a product associeated with the user'
                })
            }
             
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    }
};

module.exports=usersController