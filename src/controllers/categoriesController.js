require("dotenv").config();

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

const categoriesController={
    getCategoriesList:async(req,res)=>{
        try{
            // en esta esta petición, que únicamente la puede realizar el usuario administrador, se trae el listado de todas los categorías, y su vez se consumen las asosiaciones del modelo "Category" con el modelo "Product", a través de esta asociación, puede observase cuáles productos están abarcados en cada categoría. 
            const categories = await getAllCategories();
            if (categories.length!=0) {
                return res.status(200).json({
                    status:200,
                    categories
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no category'
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
    searchCategoriesByName:async(req,res)=>{
        try {
            // Únicamente el usuario administrador puede buscar categorías por nombre, a su vez, para la búsqueda se hace uso del operador "like", que permite especificar la condición que debiera cumplirse en la búsqued, se hace uso del comodín "%" para evitar búsquedas restrictivas. La condición de búsqueda es especificada como query de la petición. En el resultado de la búsqueda se proporionan los id de los productos abarcados por cada categoría. Con los respectivos id, pueden realizarse las correspondientes peticiones para conocer el detalle de un producto.
            const {name}=req.query;
            const categories=await searchCategoriesByName(name);
            if (categories.length!=0) {
                return res.status(200).json({
                    status:200,
                    categories
                })
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no category with this name'
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
    getCategoryDetail:async (req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobra la que se aplica la petición GET
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            return res.status(200).json({
            status:200,
            category
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    createCategory:async(req,res)=>{
        const {body}=req;
        try{
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description=undefined;
            }
            const category=await createCategory(body);
            res.status(201).json({
                status:201,
                message:'Cstegory created',
                category
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    updateCategory:async(req,res)=>{
        const {body}=req;
        const {id}=req.params;
        try{
            // Se corroborra que exista la categoría sobre la que se aplica la petición PUT
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            // En el caso que el valor de la descripción sea un string vacío, resulta necesario cambiar este valor a "undefinded" para que, por lo definido para este atributo en el modelo "Category", opere la propiedad "defaultValue"
            if (!body.description) {
                body.description="category without description";
            }
            const categoryUpdated=await updateCategory(body,id);
            res.status(201).json({
                status:201,
                message:'Category updated',
                categoryUpdated
            })
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    deleteCategory:async(req,res)=>{
        const {id}=req.params;
        try {
            // Se corroborra que exista la categoría sobre la que se aplica la petición DELETE
            const category=await findCategoryByPk(id);
            if (!category) return res.status(404).json({
                status:404,
                message:'There is no category whit this id'
            });
            const {Products}=category;
            if (Products.length!=0) return res.status(400).json({
                status: 400,
                error:`${req.user.first_name}, you can't do it, this category has at least one product associated`
            });
            await destroyCategory(id)
            return res.status(200).json({
            status:200,
            message:'Category deleted'
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

module.exports=categoriesController