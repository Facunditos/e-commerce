const {Transaction,Product}=require("./database/models/index");

async function updateTransaction(){
    try{
        const transaction=await Transaction.findByPk(35);
        const item=await transaction.addProduct([33,47,84],{
            through:{
                price:20,
                quantity:47
            }
        });  
        return console.log(item);
    } catch(e){
        return console.log(e);
    }
}

updateTransaction();