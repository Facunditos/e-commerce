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
    destroyTransaction,
    transactionAddProduct
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
    getCart:async(req,res)=>{
        const cart=Object.values(req.session.cart);
        if (cart.length==0) {
            return res.status(404).json({
                status:200,
                message:'The cart is empty',
            }); 
        } else {
            return res.status(200).json({
                status:200,
                cart,
            }); 
        };
    },
    buyCart:async(req,res)=>{
        const {user}=req;
        try {
            const items = Object.values(req.session.cart); //get items as array
            const totalPrice = items.reduce((acc, item) => {
                return acc + 1 * item.quantity;
            }, 0);
            const body={
                buyer_user_id:user.id,
                totalPrice
            };
            console.log(body);
            const transaction = await createTransaction(body);
            for (const item of items) {
                await transactionAddProduct(transaction,item)
            }
    
            req.session.cart = {};
    
            res.status(201).json({
                status:201,
                message:'Transaction created',
                transaction
            });
            
        } catch(error) {
            console.log(error)
            res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        }
    },
    addToCart:async(req,res)=>{
        const {id}=req.params;
        try{
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            if (product.status!='active') return res.status(404).json({
                status:400,
                message:'We do not have stock of this product. Choose others'
            });
            // Este código comentado se importó de MercadoLiebre. En mi desarollo no sirve porque este método es consumido únicamente para implentar la funcionalidad de agregar una unidad de un nuevo producto al carrito, para modificar las unidades del producto sumado, se utilizadn otros métodos
            /* if (!req.session.cart[product.id]) {
            req.session.cart[product.id] = {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.image_url,
                quantity: 0,
            };
            }
            req.session.cart[product.id].quantity++; */

            //Al objeto req.session.cart se le agrega una propiedad que tiene como clave el id del nuevo producto sumado al carrito. El valor de la propiedad es un objeto que informa id, url de la imagen, nombre y cantidad de este producto. La cantidad refiere a la unidad sumada al carro, no al stock del producto.  
            req.session.cart[product.id] = {
                id: product.id,
                image: product.image_url,
                name: product.name,
                price: product.price,
                quantity: 1,
            };
            //Por ser adquirida una unidad del producto, corresponde ajustar su stock, y en el caso que el stock ajustado sea igual a cero, debiera también cambiarse el atributo "status" de activo a inactivo. 
            product.stock--;
            if (product.stock==0) product.status='inactive';
            await updateProduct(product,product.id);
            return res.status(200).json({
                status:200,
                message:'Product added to cart',
                cart:req.session.cart
            });  
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    setQuantity:async(req,res)=>{
        const {id}=req.params;
        const {quantity}=req.body;
        try{
            const product=await findProductByPk(id);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            if (product.status!='active') return res.status(404).json({
                status:400,
                message:'We do not have stock of this product. Choose others'
            });
            if (quantity>product.stock) return res.status(404).json({
                status:400,
                message:`We do not have enough stock of this product. You can buy ${product.stock} as maxium` 
            });

            //Al objeto req.session.cart se le agrega una propiedad que tiene como clave el id del nuevo producto sumado al carrito. El valor de la propiedad es un objeto que informa id, url de la imagen, nombre y cantidad de este producto. La cantidad refiere a la unidad sumada al carro, no al stock del producto.  
            req.session.cart[product.id] = {
                id: product.id,
                image: product.image_url,
                name: product.name,
                price: product.price,
                quantity,
            };
            //Por ser adquirida una unidad del producto, corresponde ajustar su stock, y en el caso que el stock ajustado sea igual a cero, debiera también cambiarse el atributo "status" de activo a inactivo. 
            product.stock-=quantity;
            if (product.stock==0) product.status='inactive';
            await updateProduct(product,product.id);
            return res.status(200).json({
                status:200,
                message:'Product added to cart',
                cart:req.session.cart
            });  
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    increaseQuantity:async(req,res)=>{
        const {id}=req.params;
        try{
            const product=await findProductByPk(id);
            console.log(product);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            if (!req.session.cart[product.id]) {
            req.session.cart[product.id] = {
                id: product.id,
                name: product.name,
                /* image: product.image,
                price: Number(
                    (product.price - product.price * (product.disquantity / 100)).toFixed(2)
                ), */
                quantity: 0,
            };
            }
            req.session.cart[product.id].quantity++;
            return res.status(200).json({
                status:200,
                message:'Cart updated',
                cart:req.session.cart
            });  
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    decreseQuantity:async(req,res)=>{
        const {id}=req.params;
        try{
            const product=await findProductByPk(id);
            console.log(product);
            if (!product) return res.status(404).json({
                status:404,
                message:'There is no product whit this id'
            });
            if (!req.session.cart[product.id]) {
            req.session.cart[product.id] = {
                id: product.id,
                name: product.name,
                /* image: product.image,
                price: Number(
                    (product.price - product.price * (product.disquantity / 100)).toFixed(2)
                ), */
                quantity: 0,
            };
            }
            req.session.cart[product.id].quantity++;
            return res.status(200).json({
                status:200,
                message:'Cart updated',
                cart:req.session.cart
            });  
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        }
    },
    removeFromCart:async(req,res)=>{
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