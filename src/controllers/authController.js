require("dotenv").config();

const {uploadToBucket}=require("../services/AWS_S3");
const sendWelcomeEmail=require("../services/sendgridEmail");
const {
    getAllCategories,
    searchCategoriesByName,
    findCategoryByPk,
    findCategoryByName,
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
    createUser,
    updateUser,
    destroyUser
}=require("../repositories/usersRepository");

const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const path=require("path");

const authController={
    registerUser:async(req,res)=>{
        let {body}=req;
        //Aquellos usuarios que tienen el rol como administrador, deben ser incluidos en la lista de usuarios administradores, pues para asignarle este rol, se consulta si el usuario forma parte de esta lista, en caso que así sea se cambia el valor de la propiedad "role_id" que viene del body por el número  el número 1 -se definió en la tabla roles que el id 1 es el que corresponde para el usuario administrador-. 
        const adminUsers=["e_commerce@gmail.com"];
        try {
            //En el caso que el usuario decida subir una imagen como avatar, ésta se almacena en el bucket de Amazon. Si no sube ninguna imagen, se le asigna el avatar anónimo.
            if (req.files) {
                console.log('VAMOS');
                const {file}=req.files;
                const bucket="ecommerce1287";
                const key=`user-img/user-${Date.now()}${path.extname(file.name)}`;
                await uploadToBucket(bucket,key,file);
                body.image_url=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${key}`;
            };
            body.password=bcryptjs.hashSync(body.password,10);
            if (adminUsers.includes(body.email)) body.role_id=1;
            const user=await createUser(body);
            
            await sendWelcomeEmail(user.email,user.first_name);
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
            req.session.email=user.email;
            console.log("auth",req.session.email);
            res.status(200).json({
                status:200,
                message:'User logged',
                user,
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