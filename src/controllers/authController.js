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
        //Aquellos usuarios que tienen un rol como administrador, deben ser incluidos en la lista de usuarios administradores, pues para asignarle el rol, se consulta si el usuario forma parte de esta lista, en caso que así sea se crea la clave "is_admin" con valor true. En el modelo User, esta clave(atributo) por defecto tiene valor false 
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
            if (adminUsers.includes(body.email)) body.is_admin=true;
            const user=await createUser(body);
            
            const respuesta=await sendWelcomeEmail(user.email,user.first_name);
            console.log(respuesta);
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
};

module.exports=authController