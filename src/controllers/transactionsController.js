require("dotenv").config()
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

const transactionsController={
    getTransactionsList:async(req,res)=>{
        const {user}=req;
    
        try{
            // Se construye un objeto JSON con tres propiedades, en todos los casos el valor es un array, y a su vez existe correspondencia entre los respectivos índices de estas tres listas. 
            // 1- la primera propiedad  es el array de transacciones que contiene tanto objetos como transacciones existan, a su vez se incluyen todas las asociaciones del modelo Transaction.
            let transactions=await getAllTransactions();
            return res.render("transactions",{transactions})
            if (user.is_admin) {
                transactions=await getAllTransactions();
            } else {
               transactions=await getAllTransactionsByBuyer(user.id)
            }
            ;
            if (transactions.length===0) return res.status(404).json({
                status:404,
                message:'There is no transaction'
            });

            // 2- la segunda propiedad es el array de usuarios que actúan como vendedores en las transacciones listadas, como en una transacción puede incluirse más de un producto, en cada transacción puede involucrearse más de un usuario como vendedor, por lo tanto, los usuarios vendedores son agrupados por transación en sublistas,
                // 2-A Primero se construye un listado con los id de los usuarios vendedores, los respectivos id son buscados en la relación entre el modelo Transaction y el modelo Product, este último modelo contiene el id del usuario vendedor. A su vez este listado está integrado por sublistas, cada una de estas sublistas se corresponde con una transacción en particular, por lo tanto, en cada sublista se incluye los id de los usuarios vendedores involucrados en una transacción en particular
            let sellers_idGroupedByTransaction=[];
            transactions.map((transaction,indice)=>{
                let sellers_idOneTransaction=[];
                transaction.Products.map((product,indice)=>{
                    return sellers_idOneTransaction.push(product.seller_user_id);
                })
                return sellers_idGroupedByTransaction.push(sellers_idOneTransaction);
            });  
                // 2-B Luego, en base al listado anterior, se busca a los usuarios vendedores por su id, con igual lógica que la utilizada anteriormente, se hace uso de las sublistas para agrupar a los usuarios vendedores por transacción.
            console.log(sellers_idGroupedByTransaction);
            let sellersGroupedByTransaction=[];
            await Promise.all(
                sellers_idGroupedByTransaction.map(async sellers_idOneTransaction=>{
                let sellersOneTransaction=await Promise.all(
                    sellers_idOneTransaction.map(seller_id=> findUserByPk(seller_id))
                );
                 return sellersGroupedByTransaction.push(sellersOneTransaction);
                })
            );
            console.log(sellersGroupedByTransaction[0]);
            // 3- la tercera propiedad es el array con las categorías de los productos involucrados en las transacciones listadas, como en una transacción puede incluirse más de un producto, en cada transación puede corresponder más de una categoría de producto, por lo tanto, las categorías son agrupados por transación en sublistas
            let productsCategories_idGroupedByTransaction=[];
                // 3-A Primero se construye un listado con los id de las categorías de los productos, los respectivos id son buscados en la relación entre el modelo Transaction y el modelo Product, este último modelo contiene el id de la categoría del producto. A su vez este listado está integrado por sublistas, cada una de estas sublistas se corresponde con una transacción en particular, por lo tanto, en cada sublista se incluye los id de las categorías de los productos involucrados en una transacción en particular.
            transactions.map(e=>{
                let productsCategories_idOneTransaction=[];
                e.Products.map(product=>{
                    return productsCategories_idOneTransaction.push(product.category_id);
                });
                return productsCategories_idGroupedByTransaction.push(productsCategories_idOneTransaction);
            });  
            let productsCategoriesGroupedByTransaction=[];
                // 3-B Luego, en base al listado anterior, se buscan las categorías de los productos por los id respectivos, con igual lógica que la utilizada anteriormente, se hace uso de las sublistas para agruparlas por transacción.
            await Promise.all(
                productsCategories_idGroupedByTransaction.map(async productsCategories_idOneTransaction=>{
                    let categoriesProductsOneTransaction=await Promise.all(
                        productsCategories_idOneTransaction.map(category_id=> findCategoryByPk(category_id))
                    );
                    return productsCategoriesGroupedByTransaction.push(categoriesProductsOneTransaction);
                })
            );
            
            return res.status(200).json({
                status:200,
                transactions,
                sellersGroupedByTransaction,
                productsCategoriesGroupedByTransaction
            });
            //return res.render("transactions",{transactions,sellersGroupedByTransaction,productsCategoriesGroupedByTransaction})

        } catch(error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        };
    },
    getTransactionDetail:async (req,res)=>{
        let {id}=req.params;
        try {
            // Se construye un objeto JSON con tres propiedades: transction, sellers y categories. 
            // 1- la primera propiedad es el objeto que representa a una transacción, a su vez se incluyen todas las asociaciones del modelo Transaction, en particular, interesa mencionar la asociación con el modelo Product, que permite obtener el conjunto de productos involucrados en la transacción.
            let transaction=await findTransactionByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            // 2- la segunda propiedad es el array de usuarios que actúan como vendedores en la transacción buscada, como en una transacción puede incluirse más de un producto, es posible que más de un usuario vendedor participe en la transación, quedando cada usuario vendedor representado mediante un objeto.
                // 2-A Primero se construye un listado con los id de los usuarios vendedores, los respectivos id son buscados en la relación entre el modelo Transaction y el modelo Product, este último modelo contiene como atributo el id del usuario vendedor. 
            
            let sellers_id=[];
            transaction.Products.map(product=>{
                return sellers_id.push(product.seller_user_id);
            });
                // 2-B Luego, en base al listado anterior, se buscan las categorías de los productos por los id respectivos.
            const sellers=await Promise.all(
                sellers_id.map(seller_id=>findUserByPk(seller_id))
            );
            // 3- la tercera propiedad es el array con las categorías de los productos involucrados en la transacción buscada.
                // 3-A Primero se construye un listado con los id de las categorías de los productos, los respectivos id son buscados en la relación entre el modelo Transaction y el modelo Product, este último modelo contiene el id de la categoría del producto.
            let categories_id=[];
            transaction.Products.map(product=>{
                return categories_id.push(product.category_id);
            });    
                // 3-B Luego, en base al listado anterior, se buscan las categorías de los productos por los id respectivos.
            const categories=await Promise.all(
                categories_id.map(category_id=>findCategoryByPk(category_id))
            );
            
            return res.status(200).json({
            status:200,
            transaction,
            sellers,
            categories
            });
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    deleteTransaction:async(req,res)=>{
        let {id}=req.params;
        try {
            let transaction=await findTransactionByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            const transactionTransactions=await transaction.getBuys();
            const transactionProducts=await transaction.getProductsOnSale();
            if (transactionTransactions.length==0 && transactionProducts.length==0) {
                await destroyTransaction(id)
                return res.status(200).json({
                status:200,
                message:'Transaction deleted'
                });  
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There is at least a transaction or a product associeated with the transaction'
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

module.exports=transactionsController