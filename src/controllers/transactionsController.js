require("dotenv").config()
const {
    getAllTransactions,
    getAllTransactionsByBuyer,
    findTransactionByPk,
    createTransaction,
    updateTransaction,
    destroyTransaction,
    transactionAddProduct
}=require("../repositories/transactionsRepository");
const {findCategoryByPk}=require("../repositories/categoriesRepository");
const {findUserByPk}=require("../repositories/usersRepository");

const transactionsController={
    getTransactionsList:async(req,res)=>{
        const {user}=req;
        //El número de página al que se quiere acceder es indicado como query al final de la url.
        let {page}=req.query;
        //En caso que no haya sido indicado - req.page=undefenid -, se asigna por defecto la página 1. 
        if (!page) page=1;
        //Si el cliente definió la página que quiere consulta, pero el valor no se puede parsear, se devuelve el error.
        page=parseInt(page);
        if (isNaN(page)||page<0) return res.status(400).json({
            status:400,
            message:"Page does't exist",
        });
        page=parseInt(page);
        try{
            /* return res.render("transactions",{transactions}); */
            //La clave count almacena la cantidad de transacciones encontradas para la query especificada, sin tener en cuenta si se indicó limitar la cantidad de registros devueltos. La clase rows almacena el array de transacciones que se quieren mostrar. 
            let count;
            let rows;
            if (user.Role.name=="Admin") {
                const results=await getAllTransactions(5*(page-1));
                count=results.count;
                rows=results.rows;
            } else {
                const results=await getAllTransactionsByBuyer(user.id);
                count=results.count;
                rows=results.rows;
            };
            if (count==0) return res.status(404).json({
                status:404,
                message:'There is no transaction'
            });
            //En base a considerar que se quiere devolver cinco registros, se indica la máxima página que corresponde según la cantidad de transacciones encontradas. 
            const maxPage=Math.ceil(count/5);
            if (maxPage<page) return res.status(400).json({
                status:400,
                message:"Page does't exist",
            });
            const previousPage=page==1?1:page-1;
            const nextPage=page==maxPage?page:page+1;
            return res.status(200).json({
                status:200,
                previouspage:`/me/transactions?page=${previousPage}`,
                nextpage:`/me/transactions?page=${nextPage}`,
                count,
                transactions:rows,
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
        const {id}=req.params;
        const userInToken=req.user;
        try {
            const transaction=await findTransactionByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            if (userInToken.Role.name=="Buyer"&&userInToken.id!==transaction.buyer_user_id) return res.status(403).json({
                status:403,
                message:`${userInToken.first_name}, you don't have permission to do it`,
            });
            return res.status(200).json({
            status:200,
            transaction,
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
        const {id}=req.params;
        const userInToken=req.user;
        try {
            const transaction=await findTransactionByPk(id);
            if (!transaction) return res.status(404).json({
                status:404,
                message:'There is no transaction whit this id'
            });
            //El usuario que es Admin tiene habilitada la opción de eliminar la transacción. El usuario Buyer la puede eliminar si es efectivamente quien actuó como comprador en esta transacción, de esta manera se imposibilitada que un usuario que no es Admin pueda eliminar una transacción de la que no participa como comprador. 
            if (userInToken.Role.name=="Buyer"&&userInToken.id!==transaction.buyer_user_id) return res.status(403).json({
                status:403,
                message:`${userInToken.first_name}, you don't have permission to do it`,
            });
            // Primero se eliminan los registros en la tabla intermedia setéandose un array vacío para la asociación con Products. 
            await transaction.setProducts([]);
            await destroyTransaction(transaction.id)
            return res.status(200).json({
                message:'transaction deleted'
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