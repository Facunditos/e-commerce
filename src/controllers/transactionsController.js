require("dotenv").config()
const {
    getAll,
    getAllByBuyer,
    findByPk,
    create,
    destroy,
}=require("../repositories/transactionsRepository");

const {
    getAllUsers,
    findUserByPk,
    findUserByEmail,
    findUserByType
}=require("../repositories/usersRepository");

const {
    getAllPurchase,
    findPurchaseByTransaction,
    createPurchase,
    destroypurchasedProducts,
}=require("../repositories/transactions_productsRepository");

const transactionsController={
    getTransactionsList:async(req,res)=>{
        try{
            const {user}=req;
            let transactions;

            if (user.is_admin) {

                transactions= await getAll()
                ;
            } else {
               
            };
            if (transactions!=0) {
                res.status(200).json({
                    status:200,
                    transactions
                });
            } else {
                return res.status(404).json({
                    status:404,
                    message:'There are no transaction'
                }) 
            };
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    getTransactionDetail:async (req,res)=>{
        let {id}=req.params;
        try {
            let transaction=await findByPk(id);
            console.log(transaction.Products);
            let sellers_id=[];
            transaction.Products.map(e=>
                sellers_id.push(e.seller_user_id)
            );
            let sellers=[];
            sellers_id.map(e=>{
              let user=await findUserByPk(e);
              sellers.push(user)
            })
            
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            return res.status(200).json({
            status:200,
            transaction
            });  
        
        } catch(error) {
            console.log(error)
            return res.status(500).json({
                status:500,
                message:'Server error'
            })
            
        }
    },
    createTransaction:async(req,res)=>{
        try {
            let {id}=req.user
            let {first_product_id,second_product_id,first_product_quantity,second_product_quantity}=req.body;

            let product_idList=[first_product_id,second_product_id];
            let product_idCleanList=product_idList.filter(id=>id>0);

            let product_quantityList=[first_product_quantity,second_product_quantity];
            let product_quantityCleanList=product_quantityList.filter(quantity=>quantity>0);

            let transaction=await create(id);
            for (let i=0;i<product_idCleanList.length;i++) {
                await createPurchase(transaction.id,product_idCleanList[i],product_quantityCleanList[i]);
            };
            transaction=await findByPk(transaction.id);
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
    updateTransaction:async(req,res)=>{
        let {id}=req.params;
        let {body}=req;
        try {
            let transaction=await findByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            body.password=bcryptjs.hashSync(body.password,10);
            const transactionUpdated=await update(body,id)
            return res.status(200).json({
            status:200,
            message:'Transaction updated',
            transactionUpdated
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
            let transaction=await findByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            const transactionTransactions=await transaction.getBuys();
            const transactionProducts=await transaction.getProductsOnSale();
            if (transactionTransactions.length==0 && transactionProducts.length==0) {
                await destroy(id)
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