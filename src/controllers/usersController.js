require("dotenv").config();
const path=require("path");
const {uploadToBucket,deleteFromBucket}=require("../services/AWS_S3");
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
    searchUsersByEmail,
    createUser,
    updateUser,
    destroyUser
}=require("../repositories/usersRepository");

const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");

const usersController={
    getUsersList:async(req,res)=>{
        try{
            // en esta esta petición, que únicamente la puede realizar el usuario administrador, se trae el listado de todos los usuarios, y su vez se consumen las asosiaciones del modelo "User" con los modelos "Transaction" y "Product": a través de la primera asociación -alias: "buys"-, puede observase por usuario en cuáles transacciones participó como comprador; y en la segunda asociación -alias: "productsOnSale"-,puede observase cuáles productos tiene a la venta. 
            const users = await getAllUsers();
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
    searchUsersByEmail:async(req,res)=>{
        try {
            // Únicamente el usuario administrador puede buscar usuarios por email, a su vez, para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse en la búsqued, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de las transacciones en las que hayan involucrado los usuarios, en el caso de los usuarios compradores, y los id de los productos a la venta, en el caso de los usuarios vendedores. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de una transacción y también el historial de venta de un producto.

            const {email}=req.query;
            const users=await searchUsersByEmail(email);
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
        const {id}=req.params;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición GET
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // A menos que quien realice la petición sea el usuario administrador, se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición, 
            if (userInToken.id!==userInDB.id&&userInToken.Role.name!="Admin") 
                return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            return res.status(200).json({
            status:200,
            userInDB
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    updateUser:async(req,res)=>{
        const {id}=req.params;
        let {body}=req;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición PUT
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // Se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición-
            if (userInToken.id!=userInDB.id) return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            //El usuario que solicita actualizar su registro tiene la opción de cambiar su avatar; si lo hace, en el servidor de AWS, se reemplaza el viejo avatar por el que se envió en la petición, y en la DB, se realiza la actualización correspondiente en el campo "image_url" ; si no lo hace, continúa con el mismo avatar que arrastraba, sin modificaciones ni en AWS ni en la DB.
            if (req.files) {
                const bucket="ecommerce1287";
                const oldImage_url=userInDB.image_url
                const oldImage_urlArray=oldImage_url.split(".com/");
                const oldKey=oldImage_urlArray[1];
                console.log(bucket,oldKey);
                await deleteFromBucket(bucket,oldKey);
                const {file}=req.files;
                const newKey=`user-img/user-${Date.now()}${path.extname(file.name)}`;
                await uploadToBucket(bucket,newKey,file);
                body.image_url=`https://ecommerce1287.s3.sa-east-1.amazonaws.com/${newKey}`;
            } else {
                body.image_url=userInDB.image_url;
            }
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
        const {id}=req.params;
        const userInToken=req.user;
        try {
            // Se corroborra que exista el usuario sobre el que se aplica la petición DELETE
            const userInDB=await findUserByPk(id);
            if (!userInDB) return res.status(404).json({
                status:404,
                message:'There is no user whit this id'
            });
            // Se corroborra que coincida el usuario que realiza la petición y el usuario sobre el que se aplica la petición-
            if (userInToken.id!=userInDB.id) return res.status(403).json({
                    status:403,
                    message:`${req.user.first_name}, you don't have permission to do it`,
            });
            const {Buys,ProductsOnSale}=userInDB;
            if (Buys.length!=0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, you have made at least one buy`
            });
            if (ProductsOnSale.length!=0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, you have at least one product on sale`
            });
            await destroyUser(id)
            return res.status(200).json({
            status:200,
            message:'User deleted'
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
};

module.exports=usersController