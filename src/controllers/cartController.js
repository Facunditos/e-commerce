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
        const userId=req.user.id;
        let cart=req.session.carts[userId];
        cart=Object.values(cart);
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
        const productId=req.params.id;
        const userId=req.user.id;
        //En el caso que el usuario agregue por primera vez un producto a su carro, primero creamos el carro del usuario añadiéndolo al objeto que contiene la totalidad de los carros, el carro del usuario está representado por el id del usuario.
        req.session.carts[userId]=req.session.carts[userId]||{};
        const cart=req.session.carts[userId];
        try{
            const product=await findProductByPk(productId);
            if (!product) return res.status(404).json({
                status:404,
                message:'Product not found'
            });
            if (product.status!='active') return res.status(400).json({
                status:400,
                message:'We do not have stock of the product. Choose others'
            });
            // Devolvemos error en el caso que el producto ya haya sido añadido al carro
            if (cart[product.id]) return res.status(400).json({
                status:400,
                message:'The product already exists in your cart'
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
            cart[product.id] = {
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
                cart
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
        const productId=req.params.id;
        const requestedQuantity=req.body.quantity;
        const userId=req.user.id;
        const cart=req.session.carts[userId];
        try{
            //No se evalúa si el producto está activo porque el ususario podría estar devolviendo unidades del producto, con lo cual, debería permitirse la reposición del stock, sí se evalúa que las unidades requeridas no sean superiores a las unidades en stock mas las unidades ya sumadas al carro. 
            const product=await findProductByPk(productId);
            if (!product) return res.status(404).json({
                status:404,
                message:'Product not found'
            });
            if (!cart) return res.status(400).json({
            status:400,
            message:'The product does not exists in your cart. First, you must add it' 
            });
            const productOnCart=cart[productId];
            if (!productOnCart) return res.status(400).json({
                status:400,
                message:`The product does not exists in your cart. First, you must add it` 
            });
            const oldrequestedQuantity=productOnCart.quantity;
            if (requestedQuantity>product.stock+oldrequestedQuantity) return res.status(400).json({
                status:400,
                message:`We don't have stock enough of the product. You can buy ${product.stock+oldrequestedQuantity} units at most` 
            });
            productOnCart.quantity= requestedQuantity;
            product.stock+=oldrequestedQuantity-requestedQuantity;
            // El usuario comprador puede solicitar una cantidad de unidades que implique dejar en cero el stock del producto, en este caso corresponde cambiar el status del producto a "inactive". A su vez, en el caso en que solicite una cantidad de unidades del producto menor a las que tienen en el carro, es decir, que su solicitud implique reponer el stock, si el producto estaba inactivo corresponde cambiar su estado a "active".
            if (product.stock==0) {
                product.status='inactive'
            } else if (product.stock>0 && product.status=="inactive") {
                product.status='active'
            }
            await updateProduct(product,product.id);
            return res.status(200).json({
                status:200,
                message:'Cart updated',
                cart
                
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
        const productId=req.params.id;
        const userId=req.user.id;
        const cart=req.session.carts[userId];
        try{
            const product=await findProductByPk(productId);
            if (!product) return res.status(400).json({
                status:400,
                message:'Product not found'
            });
            if (!cart) return res.status(400).json({
                status:400,
                message:'The product does not exists in your cart. First, you must add it' 
            });
            const productOnCart=cart[productId];
            if (!productOnCart) return res.status(400).json({
                status:400,
                message:`The product does not exists in your cart. First, you must add it` 
            });
            if (product.stock==0) return res.status(400).json({
                status:400,
                message:`We don't have stock enough to add a unit of the product to your cart` 
            });
            productOnCart.quantity++;
            product.stock--;
            if (product.stock==0) product.status='inactive';
            await updateProduct(product,product.id);
            return res.status(200).json({
                status:'200',
                message:'Cart updated',
                cart
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
        const productId=req.params.id;
        const userId=req.user.id;
        console.log(userId);
        const cart=req.session.carts[userId]
        try{
            const product=await findProductByPk(productId);
            if (!product) return res.status(404).json({
                status:404,
                message:'Product not found'
            });
            if (!cart) return res.status(400).json({
                status:400,
                message:'The product does not exists in your cart. First, you must add it' 
            });
            const productOnCart=cart[productId];
            if (!productOnCart) return res.status(400).json({
                status:400,
                message:`The product does not exists in your cart. First, you must add it` 
            });
            if (productOnCart.quantity==1) return res.status(400).json({
                status:400,
                message:`The product must be removed from the cart` 
            });
            productOnCart.quantity--;
            product.stock++;
            if (product.stock==1) product.status="active";
            await updateProduct(product,product.id);
            return res.status(200).json({
                status:200,
                message:'Cart updated',
                cart,
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
        const productId=req.params.id;
        const userId=req.user.id;
        const cart=req.session.carts[userId]
        try{
            const product=await findProductByPk(productId);
            if (!product) return res.status(404).json({
                status:404,
                message:'Product not found'
            });
            if (!cart) return res.status(400).json({
                status:400,
                message:'The product does not exists in your cart' 
            });
            const productOnCart=cart[productId];
            if (!productOnCart) return res.status(400).json({
                status:400,
                message:`The product does not exists in your cart` 
            });
            product.stock+=productOnCart.quantity;
            if (product.stock==productOnCart.quantity) product.status="active";
            await updateProduct(product,product.id)
            cart[productId]=undefined;
            return res.status(200).json({
                status:200,
                message:'Cart updated',
                cart,
            });  
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