require("dotenv").config();


const {
    getAllProducts,
    findProductByPk,
    createProduct,
    updateProduct,
    destroyProduct
}=require("../repositories/productsRepository");

const {
    getAllTransactions,
    getAllTransactionsByBuyer,
    findTransactionByPk,
    createTransaction,
    updateTransaction,
    destroyTransaction,
    transactionAddProduct
}=require("../repositories/transactionsRepository");


const transactionsController={
    getCart:async(req,res)=>{
        const userId=req.user.id;
        let cart=req.session.carts[userId];
        /* Hay que testear si el carro existe o está vacío, ya sea porque: 
            (a) nunca se creó - cart=undefined -. En este caso no existe; 
            (b) se creó pero se eliminaron los productos que habían sído agregados - cart={} -. En este caso está vacío */
        if (!cart) return res.status(400).json({
            status:400,
            message:'The cart does not exits' 
        });
        //Se convierte el objeto en un array que contiene por cada elemento los productos agregados al carro
        cart=Object.values(cart);
        if (cart.length==0) return res.status(200).json({
            status:200,
            message:'The cart is empty' 
        });
        cart.sort((a,b)=>{
            const difference=a.time-b.time;
            switch(true) {
                case difference>0:
                    return 1;
                case difference==0:
                    return 0;
                case difference<0:
                    return -1
            }
        });
        const cartWorth=cart.reduce((acc,product)=>{
            return acc+product.price*product.quantity;
        },0);
        const editedCart=cart.map((product)=>{
            return {
                id:product.id,
                image:product.image,
                name:product.name,
                price:new Intl.NumberFormat(undefined,{
                    style:"currency",
                    currency:"ARS",
                    minimumFractionDigits:2,
                    maximumFractionDigits:2,
                }).format(product.price),
                quantity:new Intl.NumberFormat().format(product.quantity)
            };
        });
        const editedCartWorth=new Intl.NumberFormat(undefined,{
            style:"currency",
            currency:"ARS",
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        }).format(cartWorth);
        return res.status(200).json({
            status:200,
            cart:editedCart,
            worth:editedCartWorth,
        });
    },
    buyCart:async(req,res)=>{
        const userId=req.user.id;
        const cart=req.session.carts[userId];
        if (!cart) return res.status(400).json({
            status:400,
            message:'The cart is empty' 
            });
        const productsOnCart = Object.values(cart); 
        const cartWorth = productsOnCart.reduce((acc, product) => {
            return acc + product.price * product.quantity;
        }, 0);
        const body={
            buyer_user_id:userId,
            cartWorth
        };    
        try {
            let transaction = await createTransaction(body);
            for (const product of productsOnCart) {
                await transactionAddProduct(transaction,product)
            };
            req.session.carts[userId]=undefined;
            transaction=await findTransactionByPk(transaction.id);
            transaction.worth=new Intl.NumberFormat(undefined,{
                style:"currency",
                currency:"ARS",
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }).format(transaction.worth);
            for (const detail of transaction.Products) {
                detail.TransactionProduct.price=new Intl.NumberFormat(undefined,{
                    style:"currency",
                    currency:"ARS",
                    minimumFractionDigits:2,
                    maximumFractionDigits:2,
                }).format(detail.TransactionProduct.price);
                detail.TransactionProduct.quantity=new Intl.NumberFormat().format(detail.TransactionProduct.quantity);
                
            }
            return res.status(201).json({
                status:201,
                message:'Transaction created',
                transaction,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            });
            
        }
    },
    addToCart:async(req,res)=>{
        const productId=req.params.id;
        const userId=req.user.id;
        //En el caso que el usuario agregue por primera vez undefined producto a su carro, primero creamos el carro del usuario añadiéndolo al objeto que contiene la totalidad de los carros, el carro del usuario está representado por el id del usuario.
        req.session.carts[userId]=req.session.carts[userId]||{};
        let cart=req.session.carts[userId];
        try{
            const product=await findProductByPk(productId);
            if (!product) return res.status(404).json({
                status:404,
                message:'Product not found'
            });
            if (product.status!=='active') return res.status(400).json({
                status:400,
                message:'We do not have stock of the product. Choose others'
            });
            // Devolvemos error en el caso que el producto ya haya sido añadido al carro
            if (cart[product.id]) return res.status(400).json({
                status:400,
                message:'The product already exists in your cart'
            });

            //Al objeto req.session.cart se le agrega una propiedad que tiene como clave el id del nuevo producto sumado al carrito. El valor de la propiedad es un objeto que informa, sobre este producto, el id, la url de su imagen, el nombre, la cantidad y el momento en que se suma al carro. Aclaraciones: (i) la cantidad refiere a la unidad sumada al carro, no al stock del producto; (ii) se captura el momento en que se suma al carro para, posteriormente, poder ordenar el carro -ver método sort()-.
            cart[product.id] = {
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                quantity: 1,
                time:Date.now()
            };
            const bodyToUpdateProduct={};
            //Por ser adquirida una unidad del producto, corresponde ajustar su stock, y en el caso que el stock ajustado sea igual a cero, debiera también cambiarse el atributo "status" de activo a inactivo. 
            product.stock--;
            bodyToUpdateProduct.stock=product.stock;
            if (product.stock===0) bodyToUpdateProduct.status='inactive';
            await updateProduct(product,bodyToUpdateProduct);
            //Convierto el objeto que representa al carro en un array
            cart=Object.values(cart);
            //Aplico el método reduce para conocer el valor del carro
            let cartWorth=cart.reduce((acc,product)=>{
                return acc+product.price*product.quantity;
            },0);
            //Edito el número que representa al valor del carro.
            cartWorth=new Intl.NumberFormat(undefined,{style:"currency",currency:"ARS"}).format(cartWorth);
            //Cada producto añadido al carro tienen un precio y una cantidad cuyos datos son de tipo numérico. Al querer editar el formato de número para separarlo por miles y/o agregarle el símbolo de la moneda peso, inexorablemente, se convierte el número en un string, y como el carro de session no debe almacenar números como string, debo crear una nueva variable que contenga al carro pero con los campos de números editados conforme lo expuesto recientemente. 
            const editedCart=cart.map((product)=>{
                const editedProduct= {
                    ...product,
                    subtotal:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price*product.quantity),
                    price:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price),
                    quantity:new Intl.NumberFormat().format(product.quantity)
                };
                return editedProduct
            });
            //Ordeno el carro según el momento en que cada producto fue añadido 
            editedCart.sort((a,b)=>{
                const difference=a.time-b.time;
                switch(true) {
                    case difference>0:
                        return 1;
                    case difference==0:
                        return 0;
                    case difference<0:
                        return -1
                }
            });
            return res.status(201).json({
                status:201,
                message: 'product on cart created',
                cart:editedCart,
                worth:cartWorth,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    },
    setQuantity:async(req,res)=>{
        const productId=req.params.id;
        const requestedQuantity=req.body.quantity;
        const userId=req.user.id;
        let cart=req.session.carts[userId];
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
            // esta condición evalúa si se solicita una mayor cantidad de unidades del producto agregado al carro
            if (requestedQuantity>oldrequestedQuantity) {
                if (product.status!=='active') return res.status(400).json({
                    status:400,
                    message:`We don't have stock enough to add units of the product to your cart` 
                });
                if (requestedQuantity>product.stock+oldrequestedQuantity) return res.status(400).json({
                    status:400,
                    message:`We don't have stock enough of the product. You can buy ${product.stock+oldrequestedQuantity} units at most` 
                });
            };
            productOnCart.quantity= requestedQuantity;
            product.stock-=requestedQuantity-oldrequestedQuantity;
            const bodyToUpdateProduct={};
            bodyToUpdateProduct.stock=product.stock;
            // El usuario comprador puede solicitar una cantidad de unidades que implique dejar en cero el stock del producto, en este caso corresponde cambiar el status del producto a "inactive". A su vez, en el caso en que solicite una cantidad de unidades del producto menor a las que tienen en el carro, es decir, que su solicitud implique reponer el stock, si el producto estaba inactivo corresponde cambiar su estado a "active".
            if (product.stock===0) {
                bodyToUpdateProduct.status='inactive';
            } else  {
                bodyToUpdateProduct.status='active';
            };
            await updateProduct(product,bodyToUpdateProduct);
            cart=Object.values(cart);
            let cartWorth=cart.reduce((acc,product)=>{
                return acc+product.price*product.quantity;
            },0);
            cartWorth=new Intl.NumberFormat(undefined,{style:"currency",currency:"ARS"}).format(cartWorth);
            const editedCart=cart.map((product)=>{
                const editedProduct= {
                    ...product,
                    subtotal:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price*product.quantity),
                    price:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price),
                    quantity:new Intl.NumberFormat().format(product.quantity)
                };
                return editedProduct
            });
            editedCart.sort((a,b)=>{
                const difference=a.time-b.time;
                switch(true) {
                    case difference>0:
                        return 1;
                    case difference==0:
                        return 0;
                    case difference<0:
                        return -1
                }
            });
            return res.status(200).json({
                status:200,
                message: 'product on cart updated',
                cart:editedCart,
                worth:cartWorth,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    },
    increaseQuantity:async(req,res)=>{
        const productId=req.params.id;
        const userId=req.user.id;
        let cart=req.session.carts[userId];
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
            if (product.status!=='active') return res.status(400).json({
                status:400,
                message:`We don't have stock enough to add a unit of the product to your cart` 
            });
            productOnCart.quantity++;
            product.stock--;
            const bodyToUpdateProduct={};
            bodyToUpdateProduct.stock=product.stock;
            // Corresponde modificar el status del producto en caso que el stock quedase en cero por agregar una unidad del producto al carro.
            if (product.stock===0) bodyToUpdateProduct.status='inactive';
            await updateProduct(product,bodyToUpdateProduct);
            cart=Object.values(cart);
            let cartWorth=cart.reduce((acc,product)=>{
                return acc+product.price*product.quantity;
            },0);
            cartWorth=new Intl.NumberFormat(undefined,{style:"currency",currency:"ARS"}).format(cartWorth);
            const editedCart=cart.map((product)=>{
                const editedProduct= {
                    ...product,
                    subtotal:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price*product.quantity),
                    price:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price),
                    quantity:new Intl.NumberFormat().format(product.quantity)
                };
                return editedProduct
            });
            editedCart.sort((a,b)=>{
                const difference=a.time-b.time;
                switch(true) {
                    case difference>0:
                        return 1;
                    case difference==0:
                        return 0;
                    case difference<0:
                        return -1
                }
            });
            return res.status(200).json({
                status:200,
                message: 'product on cart updated',
                cart:editedCart,
                worth:cartWorth,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    },
    decreseQuantity:async(req,res)=>{
        const productId=req.params.id;
        const userId=req.user.id;
        let cart=req.session.carts[userId]
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
            const bodyToUpdateProduct={};
            bodyToUpdateProduct.stock=product.stock;
            // Corresponde modificar el status del producto en caso que el stock quedase en uno por devolver una unidad del producto.
            if (product.stock===1) bodyToUpdateProduct.status='active';
            await updateProduct(product,bodyToUpdateProduct);
            cart=Object.values(cart);
            let cartWorth=cart.reduce((acc,product)=>{
                return acc+product.price*product.quantity;
            },0);
            cartWorth=new Intl.NumberFormat(undefined,{style:"currency",currency:"ARS"}).format(cartWorth);
            const editedCart=cart.map((product)=>{
                const editedProduct= {
                    ...product,
                    subtotal:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price*product.quantity),
                    price:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price),
                    quantity:new Intl.NumberFormat().format(product.quantity)
                };
                return editedProduct
            });
            editedCart.sort((a,b)=>{
                const difference=a.time-b.time;
                switch(true) {
                    case difference>0:
                        return 1;
                    case difference==0:
                        return 0;
                    case difference<0:
                        return -1
                }
            });
            return res.status(200).json({
                status:200,
                message: 'product on cart updated',
                cart:editedCart,
                worth:cartWorth,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    },
    removeFromCart:async(req,res)=>{
        const productId=req.params.id;
        const userId=req.user.id;
        let cart=req.session.carts[userId];
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
            let productOnCart=cart[productId];
            if (!productOnCart) return res.status(400).json({
                status:400,
                message:`The product does not exists in your cart` 
            });
            //Para quitar el producto del carro, se declara "undefined" el valor de la propiedad que representa a este producto, ya que el objeto global que representa al carro no incluye a una propiedad cuyo valor no esté definido. 
            cart[productId]=undefined;
            product.stock+=productOnCart.quantity;
            const bodyToUpdateProduct={};
            bodyToUpdateProduct.stock=product.stock;
            // Corresponde modificar el status del producto en caso que el stock haya estado en cero.
            if (product.stock===productOnCart.quantity) bodyToUpdateProduct.status='active';
            await updateProduct(product,bodyToUpdateProduct);
            cart=Object.values(cart);
            let editedCart=cart.filter((product)=>{
                return product
            });
            const cartWorth=editedCart.reduce((acc,product)=>{
                return acc+product.price*product.quantity;
            },0);
            
            const editedCartWorth=new Intl.NumberFormat(undefined,{style:"currency",currency:"ARS"}).format(cartWorth);
            editedCart=editedCart.map((product)=>{
                const editedProduct= {
                    ...product,
                    subtotal:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price*product.quantity),
                    price:new Intl.NumberFormat(undefined,{
                        style:"currency",
                        currency:"ARS",
                        minimumFractionDigits:2,
                        maximumFractionDigits:2,
                    }).format(product.price),
                    quantity:new Intl.NumberFormat().format(product.quantity)
                };
                return editedProduct
            });
            editedCart.sort((a,b)=>{
                const difference=a.time-b.time;
                switch(true) {
                    case difference>0:
                        return 1;
                    case difference==0:
                        return 0;
                    case difference<0:
                        return -1
                }
            });
            return res.status(200).json({
                status:200,
                message: 'product remove from cart',
                cart:editedCart.length>0?editedCart:"The cart is empty",
                worth:cartWorth>0?editedCartWorth:undefined,
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    },
    emptyCart:async(req,res)=>{
        const userId=req.user.id;
        let cart=req.session.carts[userId];
        try{
            if (!cart) return res.status(400).json({
                status:400,
                message:'The cart does not exist' 
            });
            cart=Object.values(cart);
            for (const productOnCart of cart) {
                const product=await findProductByPk(productOnCart.id);
                product.stock+=productOnCart.quantity;
                const bodyToUpdateProduct={};
                bodyToUpdateProduct.stock=product.stock;
                // Corresponde modificar el status del producto en caso que el stock haya estado en cero.
                if (product.stock===productOnCart.quantity) bodyToUpdateProduct.status='active';
                await updateProduct(product,bodyToUpdateProduct);
            };
            //Se vacía el carro. 
            req.session.carts[userId]= {};
            return res.status(200).json({
                status:200,
                message:'The cart is empty'
            });
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
        };
    }
};

module.exports=transactionsController